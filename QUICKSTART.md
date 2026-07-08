# TapTask Quick Start Guide

Get TapTask running in 5 minutes.

## Option 1: Docker Compose (Recommended - Easiest)

### Prerequisites
- Docker & Docker Compose installed
- 4GB free RAM
- 2GB free disk space

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd TapTask

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30-60 seconds)
docker-compose logs -f

# 4. Open browser and login
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000

# Demo credentials:
# Email: admin@hospital.local
# Password: admin123
```

### What's Running
- **Frontend:** React development server on port 5173
- **Backend:** Node.js API on port 3000
- **Database:** PostgreSQL on port 5432
- **Data:** Automatically seeded with sample data

### First Steps
1. Login with admin credentials
2. Navigate to `/tap` to try scanning a bin
3. Create a refill request
4. View the technician queue
5. Check supervisor dashboard

### Stopping Services
```bash
docker-compose down      # Stop services (keep data)
docker-compose down -v   # Stop and delete data
```

---

## Option 2: Local Development (More Control)

### Prerequisites
- Node.js 20+ ([download](https://nodejs.org))
- npm or pnpm
- SQLite3 (usually pre-installed)
- Text editor (VS Code, WebStorm, etc.)

### Steps

```bash
# 1. Clone repository
git clone <repo-url>
cd TapTask

# 2. Install dependencies for all packages
npm install

# 3. Initialize database
cd packages/backend
npm run db:migrate
npm run db:seed
cd ../..

# 4. Start development servers (in separate terminals)

# Terminal 1: Backend API
cd packages/backend
npm run dev
# Should show: ✓ TapTask backend running on http://localhost:3000

# Terminal 2: Frontend
cd packages/frontend
npm run dev
# Should show: ✓ Local: http://localhost:5173

# 5. Open http://localhost:5173 in your browser
```

### Login
- Email: `admin@hospital.local`
- Password: `admin123`

### Directory Structure
```
TapTask/
├── packages/
│   ├── backend/    # API server
│   └── frontend/   # React app
├── README.md       # Full documentation
└── docker-compose.yml
```

### Development Commands

Backend:
```bash
cd packages/backend
npm run dev           # Start dev server with auto-reload
npm run build         # Compile TypeScript
npm run db:migrate    # Run database migrations
npm run db:seed       # Add sample data
npm test              # Run tests
npm run lint          # Check code style
```

Frontend:
```bash
cd packages/frontend
npm run dev           # Start dev server with HMR
npm run build         # Build for production
npm test              # Run tests
npm run lint          # Check code style
```

---

## Option 3: Production Deployment (Advanced)

### Using Docker Image

```bash
# Build image
docker build -t taptask:1.0.0 .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/taptask \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  taptask:1.0.0
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full production setup.

---

## Testing the Application

### Scenario 1: Submit a Refill Request (Employee)

1. Login as `emp@hospital.local` / `emp123`
2. Navigate to `/tap/KBN-ICU-0042`
3. See bin details load automatically
4. Select "Request Full Refill"
5. Click "Submit Request"
6. See success message

### Scenario 2: Accept and Complete Request (Technician)

1. Login as `tech@hospital.local` / `tech123`
2. Go to "Refill Queue"
3. See pending requests
4. Click on a request → "Accept Request"
5. Click "Start Filling"
6. Click "Mark Complete"
7. Request moves to "Completed" tab

### Scenario 3: View Dashboard (Supervisor)

1. Login as admin or create supervisor account
2. Go to "Supervisor Dashboard"
3. See real-time KPIs:
   - Open requests count
   - Completed today
   - Average response time
   - Overdue requests
4. View inventory health (critical/low/stocked out)
5. See technician performance rankings

---

## Common Tasks

### Add a New User

**Via Admin Panel (UI):**
1. Login as admin
2. Go to Admin → Users
3. Click "Add User"
4. Fill in form and submit

**Via API:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@hospital.local",
    "name": "New User",
    "password": "secure-password",
    "role": "technician"
  }'
```

### Create a New Item

**Via Admin Panel:**
1. Admin → Items
2. Click "Add Item"
3. Enter item number, name, quantity
4. Click "Create"

**Via API:**
```bash
curl -X POST http://localhost:3000/api/admin/items \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "itemNumber": "INV-100",
    "name": "New Medical Item",
    "parLevel": 15,
    "binSize": 50
  }'
```

### Create a Bin and Assign NFC Tag

**Via Admin Panel:**
1. Admin → Items
2. Select item
3. Create bin with:
   - Bin code: `KBN-ICU-9999`
   - Department
   - Location
   - NFC tag ID
4. Click "Create Bin"

### View Audit Logs

**Via Admin Panel:**
1. Admin → Audit Logs
2. Filter by user or date
3. See all changes to system

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + L` | Open Login |
| `Ctrl/Cmd + ?` | Help menu |
| `Esc` | Close modal |
| `Enter` | Submit form |

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check SQLite file exists
ls -la ./data/taptask.db
```

### "Cannot find module" Error
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Returns 401 Unauthorized
- Check token in browser Network tab
- Make sure you're logged in
- Check JWT_SECRET is set correctly

### Blank White Screen
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls
- Check VITE_API_URL environment variable

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more help.

---

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🏗️ Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the design
- 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- 🔌 Review [API.md](./API.md) for API reference
- 📱 Explore React components in `packages/frontend/src/pages/`

## Support

- **Documentation:** See README.md
- **Issues:** GitHub Issues
- **Email:** support@example.com
- **Slack:** #taptask-support

---

**Happy coding! 🚀**
