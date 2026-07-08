# TapTask Architecture

Comprehensive guide to TapTask system design, decisions, and extensibility.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Healthcare Hospital                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌──────▼──────────┐
        │  NFC/QR Tags   │         │  Mobile Devices │
        └────────────────┘         └──────┬──────────┘
                │                         │
                └────────────┬────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │     TapTask Frontend (React/Vite)       │
        │  Mobile-First, Touch-Optimized, Offline │
        │          http://localhost:5173          │
        └────────────────┬───────────────────────┘
                         │
        ┌────────────────▼──────────────────────────────┐
        │          HTTP/REST API Layer                  │
        │  Express.js with JWT Authentication           │
        │      http://localhost:3000/api               │
        └────────────┬───────────────────────────────┬──┘
                     │                               │
         ┌───────────▼─────────────┐    ┌──────────▼──────────┐
         │   Business Logic        │    │   External Services │
         │   - Requests            │    │   - Azure AD         │
         │   - Inventory           │    │   - SendGrid Email   │
         │   - Workflows           │    │   - MS Teams         │
         │   - Analytics           │    │   - File Storage     │
         └───────────┬─────────────┘    └────────────────────┘
                     │
         ┌───────────▼──────────────────────┐
         │     Database Layer               │
         │  SQLite (dev) / PostgreSQL (prod)│
         │  Complete audit trail            │
         └────────────────────────────────┘
```

## Layered Architecture

### 1. Presentation Layer (Frontend)

**Technology:** React 18, TypeScript, Tailwind CSS, Vite

**Key Characteristics:**
- Mobile-first responsive design
- Touch-friendly UI with large buttons
- Minimized user input (auto-capture metadata)
- Dark mode support
- Progressive enhancement (works offline)

**Directory Structure:**
```
packages/frontend/
├── src/
│   ├── pages/          # Route pages
│   ├── components/     # Reusable components
│   ├── store/          # Zustand state management
│   ├── api/            # API client
│   ├── hooks/          # Custom React hooks
│   └── App.tsx         # Router setup
├── vite.config.ts      # Build config
├── tailwind.config.js  # Styling
└── tsconfig.json       # Type checking
```

### 2. API Layer (Backend)

**Technology:** Node.js, Express, TypeScript, JWT

**Responsibilities:**
- HTTP request handling
- Authentication & authorization
- Input validation & sanitization
- Error handling & logging
- CORS management
- Rate limiting

**Directory Structure:**
```
packages/backend/src/
├── api/
│   └── routes/         # API endpoint handlers
├── auth/               # JWT, OAuth, RBAC
├── db/                 # Database access
├── services/           # Business logic
├── middleware/         # Custom middleware
└── index.ts            # Express server setup
```

### 3. Business Logic Layer

**Key Services:**
- `AuthService` - User authentication
- `NotificationService` - Email/Teams alerts
- `WorkflowService` - Modular workflow management
- `AnalyticsService` - KPI calculations
- `InventoryService` - Stock management

**Responsibility:** Transform requests into database operations, apply business rules.

### 4. Data Access Layer

**Technology:** SQLite (dev), PostgreSQL (prod)

**Components:**
- Database class for query execution
- Migration scripts
- Schema definition (SQL)
- Transaction management

## Data Model

### Entity Relationship Diagram

```
Users
  ├─ Department (one-to-many)
  └─ Requests (one-to-many)
      └─ Bins (many-to-one)
          ├─ Items (many-to-one)
          ├─ Locations (many-to-one)
          │   └─ Departments (many-to-one)
          └─ Inventory (one-to-many)

Refills
  ├─ Requests (many-to-one)
  ├─ Bins (many-to-one)
  └─ Users (many-to-one)

AuditLogs
  └─ Users (many-to-one)

Notifications
  ├─ Users (many-to-one)
  └─ NotificationRules (many-to-one)

WorkflowModules
  (Independent, extensible)
```

### Key Tables

| Table | Purpose |
|-------|---------|
| users | System users with roles |
| departments | Hospital departments |
| locations | Physical bin locations |
| items | Inventory items |
| bins | Physical bins with NFC tags |
| requests | Refill/damage/check requests |
| refills | Fulfillment records |
| inventory | Transaction history |
| transactions | User action log |
| audit_logs | Compliance audit trail |
| notifications | System alerts |
| workflow_modules | Pluggable workflows |

## Request Flow - Employee Refill

```
1. Employee taps NFC tag on bin
   ↓
2. Browser URL: /tap/KBN-ICU-0042
   ↓
3. Frontend queries GET /api/bins/KBN-ICU-0042
   ↓
4. Backend returns bin details + par level
   ↓
5. Frontend auto-redirects to request form
   ↓
6. Employee selects:
   - Request type (refill/partial/damaged)
   - Optional: quantity, notes, photo
   ↓
7. Frontend POSTs /api/requests
   {
     "binId": "...",
     "requestType": "refill",
     "quantityRequested": 10,
     "notes": "...",
     "photoUrl": "..."
   }
   
   [Auto-captured: timestamp, user, device, IP]
   ↓
8. Backend validates & creates request record
   ↓
9. Database triggers:
   - Create audit log entry
   - Send notification to technician
   ↓
10. Frontend shows success screen
    ↓
11. Notification sent to technician queue
```

## Workflow Extension System

### Adding a New Workflow

Each workflow module can be added without modifying core code.

**Example: Crash Cart Checks (CC)**

1. **Define in database:**
   ```sql
   INSERT INTO workflow_modules (code, name, version)
   VALUES ('CC', 'Crash Cart Checks', '1.0.0');
   ```

2. **Create backend handler:**
   ```typescript
   // src/api/routes/workflows/cc.ts
   router.post('/cc-requests', (req, res) => {
     // Handle crash cart specific logic
   });
   ```

3. **Create frontend page:**
   ```typescript
   // src/pages/CrashCartPage.tsx
   export default function CrashCartPage() {
     // Render crash cart checklist
   }
   ```

4. **Register in router:**
   ```typescript
   // src/App.tsx
   <Route path="/tap/CC-*" element={<CrashCartPage />} />
   ```

5. **NFC tags direct to workflow:**
   ```
   NFC tag format: CC-ER-0015
   Routes to: /tap/CC-ER-0015
   Which loads CrashCartPage component
   ```

### Workflow Module Structure

```typescript
interface WorkflowModule {
  id: string
  code: string          // Unique identifier (KBN, CC, PM, etc.)
  name: string
  description: string
  version: string
  isEnabled: boolean
  config: JSONObject    // Custom config per workflow
}
```

## Authentication & Authorization

### JWT Flow

```
1. User logs in (email/password or Azure AD)
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token:
   {
     "sub": "user-id",
     "email": "...",
     "role": "employee|technician|supervisor|admin",
     "iat": timestamp,
     "exp": timestamp + 24h
   }
   ↓
4. Frontend stores token in localStorage
   ↓
5. Frontend includes in API requests:
   Authorization: Bearer <token>
   ↓
6. Backend verifies token signature
   ↓
7. Backend checks role-based permissions
```

### Role Permissions Matrix

| Action | Employee | Technician | Supervisor | Admin |
|--------|----------|-----------|------------|-------|
| Submit requests | ✓ | ✓ | ✓ | ✓ |
| View own requests | ✓ | - | - | - |
| View queue | - | ✓ | ✓ | ✓ |
| Accept requests | - | ✓ | ✓ | ✓ |
| View dashboard | - | - | ✓ | ✓ |
| Manage users | - | - | - | ✓ |
| View audit logs | - | - | - | ✓ |
| System config | - | - | - | ✓ |

## Performance Optimization Strategies

### Database
- **Indexing:** On frequently filtered columns (status, department, created_at)
- **Connection pooling:** Min 5, Max 20 connections
- **Query optimization:** EXPLAIN ANALYZE for slow queries
- **Partitioning:** Archive old audit logs annually

### API
- **Caching:** Redis for technician queue (30s TTL)
- **Pagination:** Always use offset/limit
- **Compression:** gzip on responses > 1KB
- **Rate limiting:** 100 req/min per user

### Frontend
- **Code splitting:** Lazy load pages
- **Image optimization:** WebP format, responsive sizing
- **Bundle analysis:** Monitor bundle size
- **Service Worker:** Offline capability
- **Lazy loading:** Defer non-critical assets

### Infrastructure
- **CDN:** Static assets to edge
- **Database replicas:** Read-only for analytics
- **Auto-scaling:** K8s horizontal pod autoscaling
- **Monitoring:** Prometheus + Grafana

## Security Architecture

### Data Flow Security

```
User Input
    ↓
Frontend Validation (Zod schemas)
    ↓
HTTP/TLS Encryption (HTTPS)
    ↓
API Request
    ↓
Rate Limiting & IP checking
    ↓
JWT Verification
    ↓
Authorization Check (RBAC)
    ↓
Input Sanitization (SQL params)
    ↓
Database (Encrypted at rest)
    ↓
Response Encryption (HTTPS)
    ↓
Frontend (CSP headers)
```

### Key Security Features
- **HTTPS Only:** All production traffic encrypted
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Content Security Policy headers
- **CSRF Protection:** SameSite cookies, CSRF tokens
- **Rate Limiting:** Prevent brute force attacks
- **Audit Logging:** Track all state changes
- **Data Encryption:** Sensitive fields in DB
- **Secrets Management:** Environment variables, vaults

## Testing Strategy

### Unit Tests
- **Backend:** Jest/Vitest for services and utilities
- **Frontend:** Vitest for components and hooks
- **Coverage Target:** > 80%

### Integration Tests
- **API:** Postman/Newman for endpoint testing
- **Database:** Test with actual schema
- **Auth:** Test JWT flow end-to-end

### E2E Tests
- **Cypress:** Full user workflows
- **Key scenarios:**
  - Login flow
  - Submit refill request
  - Accept & complete request
  - View dashboard

### Performance Tests
- **Load Testing:** Locust or k6
- **Target:** 100+ concurrent users
- **Metrics:** Response time < 500ms at p95

## Deployment Architecture

### Development Environment
- Docker Compose with PostgreSQL
- SQLite for quick prototyping
- Hot module reloading
- Full logging enabled

### Staging Environment
- Kubernetes cluster (AKS/EKS/GKE)
- PostgreSQL managed service
- Multiple replicas for HA
- Staging data from production (sanitized)

### Production Environment
- Kubernetes cluster (multi-region)
- Managed PostgreSQL with replication
- Load balancer with auto-scaling
- CDN for static assets
- Separate monitoring cluster
- Backup to cloud storage

## Scalability Considerations

### Horizontal Scaling
- **Stateless API:** Can run multiple instances
- **Session handling:** JWT (no server-side state)
- **Database connections:** Pool shared across instances

### Data Scaling
- **Time-based partitioning:** Archive old audit logs
- **Read replicas:** Separate analytics queries
- **Caching layer:** Redis for hot data
- **Database sharding:** By department if needed

### Peak Load Handling
- **Queue system:** For heavy operations
- **Batch processing:** Nightly analytics
- **Background jobs:** Async notifications
- **CDN caching:** Static assets

## Monitoring & Observability

### Metrics
- Application:
  - Request rate, latency, errors
  - Technician queue depth
  - Request completion time
  - Active users
- Infrastructure:
  - CPU, memory, disk usage
  - Network I/O
  - Database connections
  - Container restart count

### Logging
- Application logs → ELK Stack
- Audit logs → Database + S3
- Access logs → CloudWatch/DataDog
- Error tracking → Sentry

### Alerting
- High error rate (> 1%)
- API latency (p95 > 2s)
- Database down
- Critical inventory levels
- Requests waiting > 30min

## Disaster Recovery

### RPO/RTO Targets
- **RPO (Recovery Point Objective):** < 1 hour
- **RTO (Recovery Time Objective):** < 30 minutes

### Backup Strategy
- Daily incremental backups
- Weekly full backups
- 30-day retention
- Geographic redundancy
- Monthly restore drills

### Failover Procedures
1. Detect failure (health checks)
2. Promote read replica to primary
3. Update connection strings
4. Verify data integrity
5. Notify users
6. Post-incident review

## Future Roadmap

### Planned Workflows
- [ ] Preventive Maintenance tracking
- [ ] Receiving & put-away
- [ ] Cycle counting
- [ ] Expiration tracking
- [ ] Temperature monitoring
- [ ] Equipment tracking
- [ ] Safety inspections

### Technology Upgrades
- [ ] GraphQL API
- [ ] Real-time updates (WebSocket)
- [ ] AI demand forecasting
- [ ] Computer vision for inventory checks
- [ ] Voice commands
- [ ] Mobile native apps

### Feature Enhancements
- [ ] Multi-language support
- [ ] Advanced reporting (Power BI)
- [ ] Predictive analytics
- [ ] Integration with EHR systems
- [ ] Barcode scanning
- [ ] Zebra thermal label printing

---

For implementation details, see respective README files in each package.
