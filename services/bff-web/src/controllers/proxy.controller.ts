import { Response, NextFunction } from 'express';
import { BffRequest } from '../middleware/auth.middleware';
import { taskClient, userClient } from '../utils/httpClient';

export async function getTasks(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const taskRes = await taskClient(req.token!).get(`/api/tasks?${query}`);
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
    return res.json({ success: true, message: 'Task deleted' });
  } catch (error) { next(error); }
}

export async function searchUsers(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query.q ?? '';
    const userRes = await userClient(req.token!).get(`/api/users/search?q=${q}`);
    return res.json(userRes.data);
  } catch (error) { next(error); }
}

export async function getNotifications(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const { notificationClient } = await import('../utils/httpClient');
    const notifRes = await notificationClient(req.token!).get(`/api/notifications?${query}`);
    return res.json(notifRes.data);
  } catch (error) { next(error); }
}

export async function markNotificationRead(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const { notificationClient } = await import('../utils/httpClient');
    const notifRes = await notificationClient(req.token!).patch(`/api/notifications/${req.params.id}/read`);
    return res.json(notifRes.data);
  } catch (error) { next(error); }
}

export async function markAllNotificationsRead(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const { notificationClient } = await import('../utils/httpClient');
    await notificationClient(req.token!).patch('/api/notifications/read-all');
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
