import { Router } from 'express';
import { db } from '../../db/database.js';
import { authMiddleware, AuthRequest, requireRole } from '../../auth/middleware.js';
import { subDays, startOfDay } from 'date-fns';

const router = Router();

// GET /api/dashboard/kpis - Supervisor KPIs
router.get('/kpis', authMiddleware, requireRole('supervisor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const today = startOfDay(new Date()).toISOString();

    // Open requests
    const openCount = await db.get<any>(
      "SELECT COUNT(*) as count FROM requests WHERE status IN ('pending', 'assigned', 'in_progress')"
    );

    // Completed today
    const completedToday = await db.get<any>(
      `SELECT COUNT(*) as count FROM requests WHERE status = 'completed' AND DATE(completed_at) = DATE(?)`,
      [new Date()]
    );

    // Average response time (in minutes)
    const avgResponse = await db.get<any>(
      `SELECT AVG((strftime('%s', completed_at) - strftime('%s', requested_at)) / 60) as avg_minutes
       FROM requests WHERE completed_at IS NOT NULL AND DATE(completed_at) = DATE(?)`
    );

    // Overdue (waiting > 30 mins)
    const overdue = await db.get<any>(
      `SELECT COUNT(*) as count FROM requests
       WHERE status != 'completed'
       AND datetime(requested_at, '+30 minutes') < CURRENT_TIMESTAMP`
    );

    // Requests by department
    const byDept = await db.all<any>(
      `SELECT d.name, COUNT(r.id) as count
       FROM requests r
       JOIN departments d ON r.department_id = d.id
       WHERE DATE(r.requested_at) = DATE(?)
       GROUP BY d.name`,
      [new Date()]
    );

    // Most requested items
    const topItems = await db.all<any>(
      `SELECT i.name, COUNT(r.id) as count
       FROM requests r
       JOIN bins b ON r.bin_id = b.id
       JOIN items i ON b.item_id = i.id
       WHERE DATE(r.requested_at) = DATE(?)
       GROUP BY i.name
       ORDER BY count DESC
       LIMIT 5`,
      [new Date()]
    );

    res.json({
      openRequests: openCount?.count || 0,
      completedToday: completedToday?.count || 0,
      avgResponseTime: Math.round(avgResponse?.avg_minutes || 0),
      overdueRequests: overdue?.count || 0,
      requestsByDepartment: byDept,
      mostRequestedItems: topItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve KPIs' });
  }
});

// GET /api/dashboard/technician-stats - Technician performance
router.get('/technician-stats', authMiddleware, requireRole('supervisor', 'admin'), async (req, res) => {
  try {
    const stats = await db.all<any>(
      `SELECT u.name, COUNT(r.id) as completed_count,
              AVG((strftime('%s', r.completed_at) - strftime('%s', r.requested_at)) / 60) as avg_response_minutes
       FROM requests r
       JOIN users u ON r.assigned_technician_id = u.id
       WHERE r.status = 'completed'
       GROUP BY u.id
       ORDER BY completed_count DESC`
    );

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve technician stats' });
  }
});

// GET /api/dashboard/inventory-health - Inventory levels
router.get('/inventory-health', authMiddleware, requireRole('supervisor', 'admin'), async (req, res) => {
  try {
    const critical = await db.all<any>(
      `SELECT b.bin_code, i.name, b.current_quantity, b.par_level
       FROM bins b
       JOIN items i ON b.item_id = i.id
       WHERE b.current_quantity < (b.par_level * 0.3)
       ORDER BY b.current_quantity`
    );

    const low = await db.all<any>(
      `SELECT b.bin_code, i.name, b.current_quantity, b.par_level
       FROM bins b
       JOIN items i ON b.item_id = i.id
       WHERE b.current_quantity BETWEEN (b.par_level * 0.3) AND b.par_level`
    );

    const stockedOut = await db.all<any>(
      `SELECT b.bin_code, i.name
       FROM bins b
       JOIN items i ON b.item_id = i.id
       WHERE b.current_quantity = 0`
    );

    res.json({
      critical: {
        count: critical.length,
        items: critical,
      },
      low: {
        count: low.length,
        items: low.slice(0, 10),
      },
      stockedOut: {
        count: stockedOut.length,
        items: stockedOut,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory health' });
  }
});

export default router;
