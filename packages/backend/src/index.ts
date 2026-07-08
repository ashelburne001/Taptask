import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { db } from './db/database.js';
import authRoutes from './api/routes/auth.js';
import binsRoutes from './api/routes/bins.js';
import requestsRoutes from './api/routes/requests.js';
import dashboardRoutes from './api/routes/dashboard.js';
import usersRoutes from './api/routes/users.js';
import adminRoutes from './api/routes/admin.js';
import { authMiddleware } from './auth/middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', authMiddleware, binsRoutes);
app.use('/api/requests', authMiddleware, requestsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize and start
async function start() {
  try {
    const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './data/taptask.db';

    // Create data directory if it doesn't exist
    const fs = await import('fs/promises');
    const dir = path.dirname(dbPath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {}

    await db.initialize(dbPath);
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`✓ TapTask backend running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
