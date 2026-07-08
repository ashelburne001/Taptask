import { Router } from 'express';
import { db } from '../../db/database.js';
import { authMiddleware } from '../../auth/middleware.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/bins/:binCode - Get bin details by code
router.get('/:binCode', authMiddleware, async (req, res) => {
  try {
    const bin = await db.get<any>(
      `SELECT b.*, i.name as item_name, i.item_number, i.gtin, i.unit_of_measure,
              i.par_level as default_par_level, l.shelf_location, l.warehouse_location,
              d.name as department_name, d.code as department_code
       FROM bins b
       JOIN items i ON b.item_id = i.id
       JOIN locations l ON b.location_id = l.id
       JOIN departments d ON b.department_id = d.id
       WHERE b.bin_code = ?`,
      [req.params.binCode]
    );

    if (!bin) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    // Get recent request history
    const history = await db.all<any>(
      `SELECT id, request_type, status, requested_at, employee_id
       FROM requests
       WHERE bin_id = ?
       ORDER BY requested_at DESC
       LIMIT 5`,
      [bin.id]
    );

    res.json({
      bin: {
        id: bin.id,
        code: bin.bin_code,
        itemName: bin.item_name,
        itemNumber: bin.item_number,
        gtin: bin.gtin,
        unitOfMeasure: bin.unit_of_measure,
        parLevel: bin.par_level || bin.default_par_level,
        currentQuantity: bin.current_quantity,
        binSize: bin.bin_size,
        departmentName: bin.department_name,
        departmentCode: bin.department_code,
        shelfLocation: bin.shelf_location,
        warehouseLocation: bin.warehouse_location,
      },
      recentHistory: history,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bin' });
  }
});

// GET /api/bins - List all bins (filterable)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { departmentId, search } = req.query;
    let query = `SELECT b.*, i.name as item_name, d.name as department_name
                 FROM bins b
                 JOIN items i ON b.item_id = i.id
                 JOIN departments d ON b.department_id = d.id
                 WHERE b.is_active = 1`;
    const params: any[] = [];

    if (departmentId) {
      query += ' AND b.department_id = ?';
      params.push(departmentId);
    }

    if (search) {
      query += ' AND (b.bin_code LIKE ? OR i.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY b.bin_code';

    const bins = await db.all<any>(query, params);

    res.json({
      bins: bins.map(b => ({
        id: b.id,
        code: b.bin_code,
        itemName: b.item_name,
        currentQuantity: b.current_quantity,
        parLevel: b.par_level,
        department: b.department_name,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bins' });
  }
});

export default router;
