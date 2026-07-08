# TapTask Deployment Guide

Complete guide for deploying TapTask to production environments.

## Pre-Deployment Checklist

- [ ] Database backups configured
- [ ] SSL certificates obtained
- [ ] Environment variables secured (use secrets manager)
- [ ] Admin user credentials set
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Rate limiting configured
- [ ] Email service configured
- [ ] Teams/Slack webhooks configured
- [ ] Azure AD app registered (if using)

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t taptask:1.0.0 .

# Tag for registry
docker tag taptask:1.0.0 myregistry.azurecr.io/taptask:1.0.0

# Push to registry
docker push myregistry.azurecr.io/taptask:1.0.0
```

### Run Docker Container

```bash
docker run -d \
  --name taptask \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/taptask \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  -e CORS_ORIGIN=https://app.example.com \
  -v /data/taptask:/app/data \
  myregistry.azurecr.io/taptask:1.0.0
```

## Docker Compose Production

```yaml
version: '3.8'

services:
  backend:
    image: taptask:1.0.0
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taptask:${DB_PASSWORD}@postgres:5432/taptask
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - taptask
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: taptask
      POSTGRES_USER: taptask
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taptask"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - taptask

volumes:
  postgres-data:

networks:
  taptask:
```

## Kubernetes Deployment

### Create Namespace
```bash
kubectl create namespace taptask
```

### Create Secrets
```bash
kubectl create secret generic taptask-secrets \
  --from-literal=jwt-secret="$(openssl rand -base64 32)" \
  --from-literal=db-password="$(openssl rand -base64 32)" \
  -n taptask

kubectl create secret docker-registry regcred \
  --docker-server=myregistry.azurecr.io \
  --docker-username=USERNAME \
  --docker-password=PASSWORD \
  -n taptask
```

### Deploy Backend
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taptask-backend
  namespace: taptask
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taptask-backend
  template:
    metadata:
      labels:
        app: taptask-backend
    spec:
      imagePullSecrets:
        - name: regcred
      containers:
        - name: backend
          image: myregistry.azurecr.io/taptask:1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              value: "postgresql://taptask:$(DB_PASSWORD)@postgres:5432/taptask"
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: taptask-secrets
                  key: db-password
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: taptask-secrets
                  key: jwt-secret
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: taptask-backend
  namespace: taptask
spec:
  selector:
    app: taptask-backend
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Database Setup

### PostgreSQL Initial Setup

```sql
-- Create database
CREATE DATABASE taptask;

-- Create user
CREATE USER taptask WITH PASSWORD 'secure-password-here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taptask TO taptask;

-- Run migrations
psql -U taptask -d taptask -f schema.sql
```

### Backup Strategy

```bash
# Daily backup
pg_dump -U taptask taptask > /backups/taptask_$(date +%Y%m%d).sql

# Weekly backup with compression
pg_dump -U taptask -Z9 taptask > /backups/taptask_$(date +%Y%W).sql.gz

# Restore from backup
psql -U taptask taptask < /backups/taptask_20240101.sql
```

### Backup to Cloud

```bash
# AWS S3
aws s3 cp /backups/taptask_$(date +%Y%m%d).sql \
  s3://my-backup-bucket/taptask/

# Azure Blob Storage
az storage blob upload \
  --account-name myaccount \
  --container-name backups \
  --name taptask_$(date +%Y%m%d).sql \
  --file /backups/taptask_$(date +%Y%m%d).sql
```

## SSL/TLS Setup

### Let's Encrypt with Nginx

```nginx
server {
  listen 80;
  server_name api.example.com;
  
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }
  
  location / {
    return 301 https://$server_name$request_uri;
  }
}

server {
  listen 443 ssl http2;
  server_name api.example.com;
  
  ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  
  location / {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Certbot Auto-Renewal

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Request certificate
certbot certonly --nginx -d api.example.com

# Auto-renewal cron
0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### Application Metrics (Prometheus)

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'taptask'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

### Centralized Logging (ELK Stack)

```json
{
  "filebeat.inputs": [
    {
      "type": "log",
      "enabled": true,
      "paths": ["/app/logs/*.log"],
      "json.message_key": "log",
      "json.keys_under_root": true,
      "json.add_error_key": true
    }
  ],
  "output.elasticsearch": {
    "hosts": ["elasticsearch:9200"]
  }
}
```

## Performance Optimization

### Database Connection Pooling
```env
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
```

### Caching Strategy
```typescript
// Cache refill queue for 30 seconds
app.use('/api/requests', cache('30 seconds'))
```

### CDN for Static Assets
```bash
# Upload frontend build to CDN
aws s3 sync ./packages/frontend/dist s3://cdn-bucket/taptask/
```

## Health Checks

### Liveness Probe
```bash
curl http://localhost:3000/health
```

### Readiness Probe
```bash
curl http://localhost:3000/ready
```

## Disaster Recovery

### Backup & Restore Plan

1. **Daily Backups**: Every 24 hours at 2 AM UTC
2. **Retention**: Keep 30 days of backups
3. **Geographic Redundancy**: Store in multiple regions
4. **Test Restores**: Monthly restore practice

### Failover Strategy

```bash
# If primary fails, promote replica
repmgr standby promote -f /etc/repmgr.conf

# Or use managed services with automatic failover
# AWS RDS: Multi-AZ deployment
# Azure Database: Geo-redundancy
```

## Maintenance Windows

```bash
# Schedule maintenance
- Tuesdays 2-4 AM UTC
- Expected downtime: <15 minutes
- Notification: 24 hours in advance

# During maintenance:
# 1. Set maintenance page
# 2. Run migrations
# 3. Clear caches
# 4. Verify health checks
# 5. Restore service
```

## Scaling Recommendations

### Vertical Scaling
- Small deployment (< 100 users): 2vCPU, 4GB RAM
- Medium (100-1000): 4vCPU, 8GB RAM
- Large (> 1000): 8vCPU, 16GB RAM

### Horizontal Scaling
```bash
# Kubernetes auto-scaling
kubectl autoscale deployment taptask-backend \
  --min=3 --max=10 \
  --cpu-percent=70
```

## Security Hardening

### Secrets Management
```bash
# Use Azure Key Vault
az keyvault secret set \
  --vault-name TapTaskVault \
  --name JWT-SECRET \
  --value "$(openssl rand -base64 32)"

# Reference in K8s
valueFrom:
  secretKeyRef:
    name: taptask-secrets
    key: jwt-secret
```

### Network Security
- Enable WAF (Web Application Firewall)
- Restrict database access to app servers only
- Use VPC/private subnets
- Enable DDoS protection

### Audit & Compliance
- Enable API logging
- Set up CloudTrail/Audit logging
- Configure SIEM integration
- Regular security audits

## Rollback Procedure

```bash
# If deployment has issues:

# Kubernetes rollback
kubectl rollout history deployment/taptask-backend -n taptask
kubectl rollout undo deployment/taptask-backend -n taptask

# Docker rollback
docker stop taptask
docker rm taptask
docker run -d ... myregistry.azurecr.io/taptask:previous-version
```

## Support & Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues.

Contact: devops@example.com
