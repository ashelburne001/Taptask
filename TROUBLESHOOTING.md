# TapTask Troubleshooting Guide

Common issues and solutions for TapTask deployment and usage.

## Development Issues

### Port Already in Use

**Problem**: Port 3000 or 5173 already in use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Failed

**Problem**: `Cannot connect to database`

```bash
# Check SQLite file exists
ls -la ./data/taptask.db

# Check PostgreSQL connection string
echo $DATABASE_URL

# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1"

# Reset SQLite (development only)
rm ./data/taptask.db
npm run db:migrate
npm run db:seed
```

### Module Not Found Errors

**Problem**: `Cannot find module 'xyz'`

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist/
npm run build
```

### API Returns 401 Unauthorized

**Problem**: Token is missing or invalid

```bash
# Check token is being sent
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/auth/me

# Verify token format
# Should be: Bearer <token>, not just <token>

# Check JWT_SECRET matches
echo $JWT_SECRET
```

## Docker Issues

### Container Won't Start

```bash
# View logs
docker logs taptask

# Common issues:
# 1. Port already in use
docker ps  # Check running containers
docker stop <container_id>

# 2. Database connection
docker exec taptask npm run db:migrate

# 3. Environment variables missing
docker inspect taptask | grep -A 50 "Env"
```

### Docker Compose Database Connection Failed

```bash
# Wait for PostgreSQL to be ready
docker-compose logs postgres

# Manually run migrations in container
docker-compose exec backend npm run db:migrate

# Reset everything
docker-compose down -v
docker-compose up -d
```

## Deployment Issues

### SSL Certificate Not Trusted

```bash
# Check certificate validity
openssl s_client -connect api.example.com:443

# Renew Let's Encrypt certificate
certbot renew --force-renewal

# Check certificate dates
certbot certificates
```

### High Database Queries

```bash
# Enable query logging
# In PostgreSQL:
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();

# Review slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Memory Leak

```bash
# Check Node.js process memory
ps aux | grep node

# Enable heap snapshot
node --inspect --expose-gc app.js

# In DevTools: Chrome://inspect
```

### Slow API Response

```bash
# 1. Check database performance
EXPLAIN ANALYZE SELECT * FROM requests WHERE status = 'pending';

# 2. Add indexes if needed
CREATE INDEX idx_requests_status ON requests(status);

# 3. Check API logs for bottlenecks
grep "response_time" app.log | sort -t= -k2 -rn | head

# 4. Monitor with profiler
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

## Frontend Issues

### Blank White Screen

```bash
# Check browser console for errors
# Press F12 or right-click → Inspect

# Common issues:
# 1. API URL incorrect
# Check VITE_API_URL environment variable

# 2. CORS error
# Check browser console for CORS errors
# Verify CORS_ORIGIN in backend matches frontend domain

# 3. React compilation error
npm run type-check
npm run build
```

### Login Not Working

```bash
# Check credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.local","password":"admin123"}'

# Check user exists
sqlite3 ./data/taptask.db "SELECT * FROM users WHERE email='admin@hospital.local';"

# Reset password (admin only)
UPDATE users SET password_hash = NULL WHERE email = 'admin@hospital.local';
```

### NFC Tag Not Reading

```bash
# Test NFC functionality
# 1. Check browser supports NFC
# Only Safari on iOS and Edge on Windows support Web NFC API

# 2. Check tag format
# Tag should contain URL: https://app.example.com/tap/KBN-ICU-0042

# 3. Test QR code fallback
# Try QR code scanning instead

# 4. Check network connectivity
# Ensure device can reach backend
```

### Slow Frontend Performance

```bash
# Analyze bundle size
npm run build
npm run analyze

# Check Network tab in DevTools
# Look for large files or slow API calls

# Enable performance monitoring
// In src/main.tsx
import { performance } from 'web-vitals'
performance.onLCP(console.log)
```

## Authentication Issues

### Azure AD Not Working

```bash
# Check Azure AD app registration
# In Azure Portal:
# 1. App registrations → Find TapTask app
# 2. Verify Redirect URI: https://app.example.com/auth/callback
# 3. Check client credentials

# Test Azure AD connection
curl -X POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token \
  -d "grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}&scope=.default"
```

### JWT Token Expired

```bash
# Tokens are short-lived (default 24h)
# Issue: User sees "unauthorized" after timeout

# Solution: Implement refresh token
# Frontend should:
# 1. Catch 401 response
# 2. Call refresh endpoint
# 3. Get new token
# 4. Retry request

# Check token expiry
node -e "console.log(JSON.parse(Buffer.from('TOKEN'.split('.')[1], 'base64').toString()))"
```

## Performance Optimization

### Database is Slow

```bash
# Analyze query performance
EXPLAIN ANALYZE 
SELECT * FROM requests 
WHERE status = 'pending' 
ORDER BY requested_at DESC;

# Add missing indexes
CREATE INDEX idx_requests_bin ON requests(bin_id);
CREATE INDEX idx_bins_location ON bins(location_id);
CREATE INDEX idx_inventory_created ON inventory(created_at DESC);

# Vacuum and analyze
VACUUM;
ANALYZE;
```

### API Response Time > 1 second

```bash
# Profile the bottleneck
# 1. Check database queries in logs
# 2. Look for N+1 query problems
# 3. Add caching layer

# Example: Cache technician queue
const redis = require('redis');
const client = redis.createClient();

app.get('/api/requests', async (req, res) => {
  const cached = await client.get('requests:pending');
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await db.all(...);
  await client.setex('requests:pending', 30, JSON.stringify(data));
  res.json(data);
});
```

### High CPU Usage

```bash
# Check for infinite loops or inefficient code
# Use Node profiler
node --prof server.js

# Kill heavy process
killall -9 node

# Review logs for errors causing retries
grep ERROR logs/*.log | tail -20
```

## Monitoring & Logging

### Enable Debug Logging

```bash
# Backend
DEBUG=* npm run dev
LOG_LEVEL=debug npm start

# Frontend
VITE_LOG_LEVEL=debug npm run dev

# Docker
docker run -e DEBUG=* taptask:latest
```

### View Application Logs

```bash
# Docker container
docker logs -f taptask

# Docker Compose
docker-compose logs -f backend

# System logs
journalctl -u taptask -f
tail -f /var/log/taptask.log

# Kubernetes
kubectl logs -f deployment/taptask-backend
```

### Set Up Alerts

```bash
# Create alerts for:
# - High error rate
# - Database connection failures
# - API response time > 2s
# - Disk space < 10%
# - Memory usage > 80%

# Example: Using Prometheus + AlertManager
groups:
  - name: taptask
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## Common Error Messages

### "Database is locked"

```bash
# SQLite issue: Only one write at a time
# Solution: Switch to PostgreSQL for production

# Temporary fix:
# Increase busy timeout
DB_BUSY_TIMEOUT=5000
```

### "ENOSPC: no space left on device"

```bash
# Check disk space
df -h

# Clean up old logs
rm -f logs/*.log

# Clean Docker images
docker system prune
```

### "Connection timeout"

```bash
# Check network connectivity
ping api.example.com

# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp

# Check if service is running
systemctl status taptask
```

## Getting Help

1. **Check logs first** - 80% of issues are in the logs
2. **Reproduce locally** - Before reporting, test locally
3. **Provide context**:
   - What version? (`npm list`)
   - What OS? (`uname -a`)
   - Full error message and stack trace
   - Steps to reproduce
4. **Contact support**:
   - GitHub Issues: Issues with code
   - Email: support@example.com
   - Slack: #taptask-support
   - Documentation: https://docs.example.com

## Emergency Procedures

### Service Down - Quick Recovery

```bash
# 1. Check if service running
systemctl status taptask

# 2. Restart service
systemctl restart taptask

# 3. Check database
psql -U taptask -c "SELECT 1"

# 4. If still down, restore from backup
psql -U taptask taptask < backup.sql

# 5. Contact ops team
# Page on-call engineer
```

### Data Corruption

```bash
# 1. Stop application immediately
systemctl stop taptask

# 2. Restore from latest clean backup
# 3. Verify data integrity
# 4. Gradually bring service back online
# 5. Run consistency checks

SELECT COUNT(*) FROM requests;
SELECT COUNT(*) FROM bins;
-- Verify counts match expected
```

---

For additional help, see [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)
