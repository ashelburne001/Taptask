import { Router } from 'express';
import { db } from '../../db/database.js';
import { authMiddleware, AuthRequest } from '../../auth/middleware.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/requests - Create new request (employee taps bin)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { binId, requestType, quantityRequested, notes, photoUrl } = req.body;

    if (!binId || !requestType || !['refill', 'partial_refill', 'damaged'].includes(requestType)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const bin = await db.get<any>('SELECT * FROM bins WHERE id = ?', [binId]);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    const requestId = uuidv4();

    await db.run(
      `INSERT INTO requests (id, bin_id, request_type, employee_id, department_id, status,
                            quantity_requested, notes, photo_url)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [requestId, binId, requestType, req.user!.id, bin.department_id, quantityRequested || bin.par_level, notes, photoUrl]
    );

    // Log transaction
    await db.run(
      `INSERT INTO transactions (id, user_id, action, resource_type, resource_id, ip_address, device_info)
       VALUES (?, ?, 'create_request', 'request', ?, ?, ?)`,
      [uuidv4(), req.user!.id, requestId, req.ip, req.get('user-agent')]
    );

    res.status(201).json({
      id: requestId,
      status: 'pending',
      message: 'Request submitted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// GET /api/requests - List requests (filterable by status, department, technician)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, departmentId, technicianId, limit = 50, offset = 0 } = req.query;
    let query = `SELECT r.*, b.bin_code, i.name as item_name, u.name as employee_name,
                        t.name as technician_name, d.name as department_name
                 FROM requests r
                 JOIN bins b ON r.bin_id = b.id
                 JOIN items i ON b.item_id = i.id
                 JOIN users u ON r.employee_id = u.id
                 LEFT JOIN users t ON r.assigned_technician_id = t.id
                 JOIN departments d ON r.department_id = d.id
                 WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    if (departmentId) {
      query += ' AND r.department_id = ?';
      params.push(departmentId);
    }

    if (technicianId) {
      query += ' AND r.assigned_technician_id = ?';
      params.push(technicianId);
    }

    query += ' ORDER BY r.requested_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const requests = await db.all<any>(query, params);

    const countResult = await db.get<any>(
      'SELECT COUNT(*) as count FROM requests WHERE status = ?',
      [status || 'pending']
    );

    res.json({
      requests: requests.map(r => ({
        id: r.id,
        binCode: r.bin_code,
        itemName: r.item_name,
        requestType: r.request_type,
        status: r.status,
        quantityRequested: r.quantity_requested,
        quantityFilled: r.quantity_filled,
        employeeName: r.employee_name,
        technicianName: r.technician_name,
        departmentName: r.department_name,
        priority: r.priority,
        requestedAt: r.requested_at,
        completedAt: r.completed_at,
        notes: r.notes,
      })),
      total: countResult?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
});

// PATCH /api/requests/:requestId - Update request status
router.patch('/:requestId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, assignedTechnicianId, quantityFilled } = req.body;
    const { requestId } = req.params;

    const request = await db.get<any>('SELECT * FROM requests WHERE id = ?', [requestId]);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status && ['pending', 'assigned', 'in_progress', 'completed', 'unable_to_fill'].includes(status)) {
      updates.push('status = ?');
      values.push(status);
      if (status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      }
    }

    if (assignedTechnicianId) {
      updates.push('assigned_technician_id = ?');
      values.push(assignedTechnicianId);
    }

    if (quantityFilled !== undefined) {
      updates.push('quantity_filled = ?');
      values.push(quantityFilled);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    values.push(requestId);
    await db.run(`UPDATE requests SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

export default router;
