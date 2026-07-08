import { Router } from 'express'
import { db } from '../../db/database.js'
import { authMiddleware, AuthRequest, requireRole } from '../../auth/middleware.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const router = Router()

// GET /api/users - List all users (admin only)
router.get('/', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { departmentId, role, search } = req.query
    let query = 'SELECT id, email, name, role, department_id, is_active, last_login FROM users WHERE 1=1'
    const params: any[] = []

    if (departmentId) {
      query += ' AND department_id = ?'
      params.push(departmentId)
    }

    if (role) {
      query += ' AND role = ?'
      params.push(role)
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY name'

    const users = await db.all<any>(query, params)

    res.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        departmentId: u.department_id,
        isActive: u.is_active,
        lastLogin: u.last_login,
      })),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' })
  }
})

// POST /api/users - Create new user (admin only)
router.post('/', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { email, name, password, role, departmentId } = req.body

    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const id = uuidv4()
    const passwordHash = await bcrypt.hash(password, 10)

    await db.run(
      `INSERT INTO users (id, email, name, password_hash, role, department_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, email, name, passwordHash, role, departmentId || null]
    )

    res.status(201).json({
      id,
      email,
      name,
      role,
      departmentId,
    })
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// PATCH /api/users/:userId - Update user (admin only)
router.patch('/:userId', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { name, email, role, departmentId, isActive } = req.body
    const { userId } = req.params

    const updates: string[] = []
    const params: any[] = []

    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }
    if (email !== undefined) {
      updates.push('email = ?')
      params.push(email)
    }
    if (role !== undefined) {
      updates.push('role = ?')
      params.push(role)
    }
    if (departmentId !== undefined) {
      updates.push('department_id = ?')
      params.push(departmentId)
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?')
      params.push(isActive ? 1 : 0)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' })
    }

    params.push(userId)
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params)

    res.json({ message: 'User updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/users/:userId - Soft delete user
router.delete('/:userId', authMiddleware, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params
    await db.run('UPDATE users SET is_active = 0 WHERE id = ?', [userId])
    res.json({ message: 'User deactivated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
