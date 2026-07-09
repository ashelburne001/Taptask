import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  departmentId?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  departmentId?: string;
  isActive: boolean;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
  private jwtExpiry: string | number = process.env.JWT_EXPIRY || '24h';

  async register(email: string, name: string, password: string, role: string = 'employee'): Promise<User> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      await db.run(
        'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [id, email, name, passwordHash, role]
      );

      return {
        id,
        email,
        name,
        role,
        isActive: true,
      };
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await db.get<any>(
      'SELECT id, email, name, role, department_id, is_active FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
      throw new Error('User account is inactive');
    }

    const passwordHash = await db.get<any>(
      'SELECT password_hash FROM users WHERE id = ?',
      [user.id]
    );

    if (!passwordHash || !passwordHash.password_hash) {
      throw new Error('User has no password set (use Azure AD or contact admin)');
    }

    const validPassword = await bcrypt.compare(password, passwordHash.password_hash);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.department_id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        departmentId: user.department_id,
        isActive: user.is_active,
      },
    };
  }

  generateToken(payload: TokenPayload): string {
    const secret = this.jwtSecret || 'dev-secret-change-me';
    return jwt.sign(payload, secret, {
      expiresIn: '24h',
    } as any);
  }

  verifyToken(token: string): TokenPayload {
    try {
      const secret = this.jwtSecret || 'dev-secret-change-me';
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await db.get<any>(
      'SELECT id, email, name, role, department_id, is_active FROM users WHERE id = ?',
      [id]
    );

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.department_id,
      isActive: user.is_active,
    };
  }
}

export const authService = new AuthService();
