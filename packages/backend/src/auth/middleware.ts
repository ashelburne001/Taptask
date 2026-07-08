import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    departmentId?: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = authService.verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      departmentId: payload.departmentId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const payload = authService.verifyToken(token);
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        departmentId: payload.departmentId,
      };
    } catch {
      // Token invalid but optional, continue
    }
  }

  next();
}
