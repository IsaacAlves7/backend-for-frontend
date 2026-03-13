import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';

export interface BffRequest extends Request {
  userId?: string;
  userEmail?: string;
  token?: string;
}

export async function authenticate(req: BffRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const token = authHeader.slice(7);
    const { data } = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      headers: { authorization: authHeader },
    });
    if (!data.success) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.userId = data.data.userId;
    req.userEmail = data.data.email;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}
