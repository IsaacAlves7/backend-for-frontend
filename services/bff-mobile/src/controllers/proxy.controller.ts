import { Response, NextFunction } from 'express';
import { BffRequest } from '../middleware/auth.middleware';
import { authClient, userClient, taskClient, notificationClient } from '../utils/httpClient';

export async function register(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const authRes = await authClient().post('/api/auth/register', { email, password, name });
    if (!authRes.data.success) return res.status(400).json(authRes.data);
    const { accessToken, refreshToken, expiresIn, userId } = authRes.data.data;
    await userClient(accessToken).post('/api/users', { name, email });
    return res.status(201).json({ success: true, data: { accessToken, refreshToken, expiresIn, userId } });
  } catch (error) { next(error); }
}

export async function login(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const authRes = await authClient().post('/api/auth/login', req.body);
    return res.json(authRes.data);
  } catch (error) { next(error); }
}

export async function refresh(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const authRes = await authClient().post('/api/auth/refresh', req.body);
    return res.json(authRes.data);
  } catch (error) { next(error); }
}

export async function logout(req: BffRequest, res: Response, next: NextFunction) {
  try {
    await authClient().post('/api/auth/logout', req.body);
    return res.json({ success: true });
  } catch (error) { next(error); }
}

export async function getProfile(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const userRes = await userClient(req.token!).get('/api/users/me');
    return res.json(userRes.data);
  } catch (error) { next(error); }
}

export async function updateProfile(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const userRes = await userClient(req.token!).patch('/api/users/me', req.body);
    return res.json(userRes.data);
  } catch (error) { next(error); }
}

export async function getTasks(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const taskRes = await taskClient(req.token!).get(`/api/tasks?${query}`);
    return res.json(taskRes.data);
  } catch (error) { next(error); }
}

export async function getTaskById(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const taskRes = await taskClient(req.token!).get(`/api/tasks/${req.params.id}`);
    return res.json(taskRes.data);
  } catch (error) { next(error); }
}

export async function createTask(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const taskRes = await taskClient(req.token!).post('/api/tasks', req.body);
    return res.status(201).json(taskRes.data);
  } catch (error) { next(error); }
}

export async function updateTask(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const taskRes = await taskClient(req.token!).patch(`/api/tasks/${req.params.id}`, req.body);
    return res.json(taskRes.data);
  } catch (error) { next(error); }
}

export async function deleteTask(req: BffRequest, res: Response, next: NextFunction) {
  try {
    await taskClient(req.token!).delete(`/api/tasks/${req.params.id}`);
    return res.json({ success: true });
  } catch (error) { next(error); }
}

export async function getNotifications(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const notifRes = await notificationClient(req.token!).get(`/api/notifications?${query}`);
    return res.json(notifRes.data);
  } catch (error) { next(error); }
}

export async function markNotificationRead(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const notifRes = await notificationClient(req.token!).patch(`/api/notifications/${req.params.id}/read`);
    return res.json(notifRes.data);
  } catch (error) { next(error); }
}
