import { Router } from 'express'
import { db } from '../../db/database.js'
import { authMiddleware, AuthRequest, requireRole } from '../../auth/middleware.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// ==================== DEPARTMENTS ====================

// GET /api/admin/departments
router.get('/departments', authMiddleware, requireRole('admin', 'supervisor'), async (req, res) => {
  try {
    const departments = await db.all<any>(
      'SELECT id, code, name, location, is_active FROM departments ORDER BY name'
    )
    res.json({ departments })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve departments' })
  }
})

// POST /api/admin/departments
router.post('/departments', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { code, name, location } = req.body
    if (!code || !name) {
      return res.status(400).json({ error: 'Code and name required' })
    }

    const id = uuidv4()
    await db.run(
      'INSERT INTO departments (id, code, name, location) VALUES (?, ?, ?, ?)',
      [id, code, name, location || null]
    )

    res.status(201).json({ id, code, name, location })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' })
  }
})

// PATCH /api/admin/departments/:deptId
router.patch('/departments/:deptId', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { code, name, location, isActive } = req.body
    const { deptId } = req.params

    const updates: string[] = []
    const params: any[] = []

    if (code !== undefined) {
      updates.push('code = ?')
      params.push(code)
    }
    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }
    if (location !== undefined) {
      updates.push('location = ?')
      params.push(location)
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?')
      params.push(isActive ? 1 : 0)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' })
    }

    params.push(deptId)
    await db.run(`UPDATE departments SET ${updates.join(', ')} WHERE id = ?`, params)

    res.json({ message: 'Department updated' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' })
  }
})

// ==================== ITEMS ====================

// GET /api/admin/items
router.get('/items', authMiddleware, requireRole('admin', 'supervisor'), async (req, res) => {
  try {
    const { search } = req.query
    let query = 'SELECT * FROM items WHERE is_active = 1'
    const params: any[] = []

    if (search) {
      query += ' AND (name LIKE ? OR item_number LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY name'

    const items = await db.all<any>(query, params)
    res.json({ items })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve items' })
  }
})

// POST /api/admin/items
router.post('/items', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { itemNumber, name, gtin, upc, unitOfMeasure, parLevel, binSize, imageUrl } = req.body

    if (!itemNumber || !name) {
      return res.status(400).json({ error: 'Item number and name required' })
    }

    const id = uuidv4()
    await db.run(
      `INSERT INTO items (id, item_number, name, gtin, upc, unit_of_measure, par_level, bin_size, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, itemNumber, name, gtin || null, upc || null, unitOfMeasure || 'Unit', parLevel || 10, binSize || 50, imageUrl || null]
    )

    res.status(201).json({ id })
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Item number already exists' })
    }
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// ==================== BINS ====================

// POST /api/admin/bins
router.post('/bins', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { binCode, itemId, locationId, departmentId, parLevel, binSize, nfcTagId } = req.body

    if (!binCode || !itemId || !locationId || !departmentId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const id = uuidv4()
    await db.run(
      `INSERT INTO bins (id, bin_code, item_id, location_id, department_id, par_level, bin_size, nfc_tag_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, binCode, itemId, locationId, departmentId, parLevel || 10, binSize || 50, nfcTagId || null]
    )

    res.status(201).json({ id, binCode })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bin' })
  }
})

// ==================== AUDIT & ANALYTICS ====================

// GET /api/admin/audit-log
router.get('/audit-log', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { userId, limit = 100, offset = 0 } = req.query
    let query = `SELECT al.*, u.name as user_name
                 FROM audit_logs al
                 JOIN users u ON al.user_id = u.id
                 WHERE 1=1`
    const params: any[] = []

    if (userId) {
      query += ' AND al.user_id = ?'
      params.push(userId)
    }

    query += ' ORDER BY al.timestamp DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const logs = await db.all<any>(query, params)
    res.json({ logs })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit logs' })
  }
})

// GET /api/admin/analytics
router.get('/analytics', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { period = 'today' } = req.query

    let dateFilter = "DATE(requested_at) = DATE('now')"
    if (period === 'week') {
      dateFilter = "DATE(requested_at) >= DATE('now', '-7 days')"
    } else if (period === 'month') {
      dateFilter = "DATE(requested_at) >= DATE('now', '-30 days')"
    }

    // Total requests
    const totalRequests = await db.get<any>(
      `SELECT COUNT(*) as count FROM requests WHERE ${dateFilter}`
    )

    // Average refill time
    const avgTime = await db.get<any>(
      `SELECT AVG((strftime('%s', completed_at) - strftime('%s', requested_at)) / 60) as minutes
       FROM requests WHERE status = 'completed' AND ${dateFilter}`
    )

    // Requests by status
    const byStatus = await db.all<any>(
      `SELECT status, COUNT(*) as count FROM requests WHERE ${dateFilter} GROUP BY status`
    )

    // Most stocked out items
    const stockedOut = await db.all<any>(
      `SELECT i.name, COUNT(r.id) as count
       FROM requests r
       JOIN bins b ON r.bin_id = b.id
       JOIN items i ON b.item_id = i.id
       WHERE r.request_type = 'refill' AND ${dateFilter}
       GROUP BY i.name
       ORDER BY count DESC
       LIMIT 10`
    )

    res.json({
      period,
      totalRequests: totalRequests?.count || 0,
      avgRefillTime: Math.round(avgTime?.minutes || 0),
      requestsByStatus: byStatus,
      mostStockedOut: stockedOut,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' })
  }
})

export default router
