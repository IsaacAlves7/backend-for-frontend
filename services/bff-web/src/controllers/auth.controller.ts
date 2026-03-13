import { Request, Response, NextFunction } from 'express';
import { authClient, userClient } from '../utils/httpClient';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    // 1. Create auth credentials
    const authRes = await authClient().post('/api/auth/register', { email, password, name });
    if (!authRes.data.success) return res.status(400).json(authRes.data);

    const { accessToken, refreshToken, expiresIn, userId } = authRes.data.data;

    // 2. Create user profile in user-service
    await userClient(accessToken).post('/api/users', { name, email });

    return res.status(201).json({
      success: true,
      data: { accessToken, refreshToken, expiresIn, userId },
    });
  } catch (error) { next(error); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const authRes = await authClient().post('/api/auth/login', { email, password });
    if (!authRes.data.success) return res.status(401).json(authRes.data);
    return res.json(authRes.data);
  } catch (error) { next(error); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const authRes = await authClient().post('/api/auth/refresh', { refreshToken });
    return res.json(authRes.data);
  } catch (error) { next(error); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    await authClient().post('/api/auth/logout', { refreshToken });
    return res.json({ success: true, message: 'Logged out' });
  } catch (error) { next(error); }
}
