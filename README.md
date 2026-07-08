# TapTask - NFC-Powered Kanban Replenishment

A modern, mobile-first web application for managing healthcare inventory using NFC tags (with QR code fallback). Designed for rapid replenishment workflows with minimal taps.

## 🎯 Key Features

### Core Functionality
- **NFC Tag Scanning**: Auto-launch workflows by scanning NFC tags (or QR codes)
- **Mobile-First**: Optimized for small screens, touch-friendly buttons, minimal typing
- **Fast Operations**: 2-3 taps to submit requests
- **Real-Time Dashboard**: Supervisor oversight with KPIs and inventory health
- **Technician Queue**: Manage refill requests efficiently
- **Role-Based Access**: Employee, Technician, Supervisor, Admin roles

### Workflows
- **KBN (Kanban Replenishment)**: Main inventory replenishment process
- **CC (Crash Cart Checks)**: Emergency equipment verification
- Extensible architecture for additional workflows (Receiving, Audit, Preventive Maintenance, etc.)

### Analytics & Reporting
- Daily/Weekly/Monthly performance metrics
- Average refill time tracking
- Demand forecasting data
- PAR level optimization suggestions
- Technician performance rankings
- Department-level analytics

### Security & Compliance
- JWT authentication
- Azure AD/Entra ID integration
- Role-based authorization
- Complete audit logging
- HTTPS encryption
- Encrypted database support

## 🏗️ Architecture

```
TapTask/
├── packages/
│   ├── backend/              # Node.js/Express API
│   │   ├── src/
│   │   │   ├── api/routes/   # API endpoints
│   │   │   ├── auth/         # Authentication
│   │   │   ├── db/           # Database & migrations
│   │   │   └── index.ts      # Server entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/             # React/TypeScript app
│       ├── src/
│       │   ├── api/          # API client
│       │   ├── pages/        # React pages
│       │   ├── store/        # Zustand state
│       │   ├── App.tsx       # Main router
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       └── tailwind.config.js
│
├── Dockerfile                # Production container
├── docker-compose.yml        # Local development stack
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm/pnpm
- Docker & Docker Compose (optional)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd TapTask
   npm install
   ```

2. **Initialize database**
   ```bash
   cd packages/backend
   npm run db:migrate
   npm run db:seed
   ```

3. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

4. **Login with demo credentials**
   - Admin: `admin@hospital.local` / `admin123`
   - Technician: `tech@hospital.local` / `tech123`
   - Employee: `emp@hospital.local` / `emp123`

### Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## 📋 Database Schema

### Core Tables
- **users** - System users with roles
- **departments** - Hospital departments
- **locations** - Bin locations within departments
- **items** - Inventory items with metadata
- **bins** - Physical bins with NFC tags
- **requests** - Refill/partial/damaged requests
- **refills** - Fulfillment records
- **inventory** - Transaction history
- **transactions** - User action audit trail
- **audit_logs** - Comprehensive change log
- **notifications** - System alerts
- **workflow_modules** - Pluggable workflow definitions

See `packages/backend/src/db/schema.sql` for complete schema.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Create new user account
- `GET /api/auth/me` - Get current user

### Bins & Inventory
- `GET /api/bins` - List bins
- `GET /api/bins/:binCode` - Get bin details
- `GET /api/requests` - List requests (filterable)
- `POST /api/requests` - Create refill request
- `PATCH /api/requests/:requestId` - Update request status

### Dashboard & Analytics
- `GET /api/dashboard/kpis` - Supervisor KPIs
- `GET /api/dashboard/technician-stats` - Performance metrics
- `GET /api/dashboard/inventory-health` - Stock levels

### Admin
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PATCH /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Deactivate user
- `GET /api/admin/departments` - List departments
- `POST /api/admin/departments` - Create department
- `GET /api/admin/items` - List items
- `POST /api/admin/items` - Create item
- `GET /api/admin/audit-log` - View audit trail
- `GET /api/admin/analytics` - System analytics

## 🎨 UI/UX Features

### Mobile-Optimized
- Large touch targets (minimum 44x44px)
- Dark mode support
- Safe area insets for notch/unsafe areas
- Minimal text input required
- Auto-capture of metadata (date, time, location, IP)

### Component Library
- Color scheme: Navy blue, light gray, accent blue
- Healthcare-appropriate design
- Accessible color contrast
- Responsive grid layouts
- Smooth animations and transitions

### User Flows
1. **Employee**: Tap → View item → Select type → Submit (2-3 taps)
2. **Technician**: View queue → Accept → Fill → Mark complete
3. **Supervisor**: Monitor dashboard → View trends → Manage inventory
4. **Admin**: CRUD operations → User management → System configuration

## 🔐 Authentication & Authorization

### Supported Methods
- **Local Admin**: Email/password (SQLite development, configurable)
- **Azure AD**: Microsoft Entra ID integration (production)
- **JWT**: Token-based stateless auth

### Roles & Permissions
```
Employee:
  - Submit requests
  - View own requests
  - Upload photos

Technician:
  - View queue
  - Accept assignments
  - Update inventory
  - Complete requests
  - Print labels

Supervisor:
  - View all dashboards
  - Access KPIs
  - View technician performance
  - Export reports
  - Manage requests

Admin:
  - Full system access
  - User management
  - Configuration
  - Audit logs
  - Analytics
```

## 🗄️ Database Options

### Development (Default)
```env
DATABASE_URL=sqlite:./data/taptask.db
```

### Production
```env
DB_HOST=postgres.example.com
DB_PORT=5432
DB_NAME=taptask
DB_USER=taptask_user
DB_PASSWORD=secure-password
```

PostgreSQL schemas: See `packages/backend/src/db/schema.sql`

## 📱 NFC Tag Setup

### Tag Format
Each NFC tag contains a workflow code + identifier:
```
KBN-ICU-0042          # Kanban, ICU dept, bin 42
CC-ER-0015            # Crash cart, ER dept, item 15
PM-SURGERY-0008       # Preventive maintenance
```

### Tag Configuration
1. Admin creates bin record with NFC tag ID
2. NFC tag is programmed with URL: `https://app.example.com/tap/{binCode}`
3. Employee scans tag → app launches with bin details
4. Auto-redirects to appropriate workflow

### QR Code Fallback
Generate QR codes with embedded URLs:
```
https://app.example.com/tap/KBN-ICU-0042
```

## 🧪 Testing

### Backend Tests
```bash
cd packages/backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd packages/frontend
npm test
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

## 📊 Analytics Dashboard

**Supervisor Dashboard includes:**
- Open requests count
- Completed today
- Average response time
- Overdue requests
- Requests by department (chart)
- Top requested items
- Technician performance leaderboard
- Inventory health (critical/low/stocked-out)

**Reports available:**
- PDF export
- Excel/CSV export
- Kanban cards for printing
- Management summaries

## 🔄 Workflow Extension

Adding a new workflow module:

1. **Create workflow definition**
   ```sql
   INSERT INTO workflow_modules (id, code, name, description, version)
   VALUES ('uuid', 'NEW', 'New Workflow', 'Description', '1.0.0');
   ```

2. **Add route handler**
   Create `packages/backend/src/api/routes/workflows/{code}.ts`

3. **Add UI component**
   Create `packages/frontend/src/pages/Workflow{Code}Page.tsx`

4. **Update app router**
   Add route in `packages/frontend/src/App.tsx`

Example: To add "Crash Cart Checks" (CC) workflow, NFC tags starting with `CC-` automatically route to crash cart verification form.

## 🚀 Deployment

### Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Cloud Platforms

**AWS ECS**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker build -t taptask:latest .
docker tag taptask:latest $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taptask:latest
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taptask:latest
```

**Azure Container Instances**
```bash
az container create --resource-group myResourceGroup \
  --name taptask --image taptask:latest \
  --ports 3000 --environment-variables NODE_ENV=production
```

**Heroku**
```bash
heroku container:push web
heroku container:release web
```

## 📦 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/taptask
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=24h
CORS_ORIGIN=https://app.example.com

# Azure AD
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_TENANT_ID=

# Notifications
SENDGRID_API_KEY=
TEAMS_WEBHOOK_URL=
```

### Frontend (.env.local)
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=TapTask
VITE_LOG_LEVEL=info
```

## 🔒 Security Best Practices

- ✅ HTTPS only in production
- ✅ JWT with short expiry (24h)
- ✅ Refresh token rotation
- ✅ CORS configured for specific origins
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Content Security Policy)
- ✅ CSRF tokens on state-changing operations
- ✅ Audit logging for all changes
- ✅ Encrypted database backups
- ✅ Role-based access control

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./packages/backend/src/db/schema.sql)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Decisions](./docs/ADR.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/xyz`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/xyz`
4. Create pull request with tests

## 📄 License

Proprietary - Healthcare Solutions

## 👥 Support

- Documentation: https://docs.example.com
- Issues: GitHub Issues
- Email: support@example.com
- Slack: #taptask-support

---

**Built with ❤️ for healthcare operations**
