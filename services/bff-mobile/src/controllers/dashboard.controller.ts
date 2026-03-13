import { Response, NextFunction } from 'express';
import { BffRequest } from '../middleware/auth.middleware';
import { userClient, taskClient, notificationClient } from '../utils/httpClient';

/**
 * Mobile BFF Dashboard — leaner payload than web BFF.
 * Mobile apps care about: avatar, first-name only, count badges, and
 * a trimmed task list (no description, no comments).
 */
export async function getMobileDashboard(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const token = req.token!;

    const [userRes, statsRes, urgentTasksRes, notifRes] = await Promise.allSettled([
      userClient(token).get('/api/users/me'),
      taskClient(token).get('/api/tasks/stats'),
      taskClient(token).get('/api/tasks?priority=URGENT&status=TODO&limit=3'),
      notificationClient(token).get('/api/notifications/unread-count'),
    ]);

    const rawUser = userRes.status === 'fulfilled' ? userRes.value.data.data : null;
    const taskStats = statsRes.status === 'fulfilled' ? statsRes.value.data.data : null;
    const urgentTasks = urgentTasksRes.status === 'fulfilled'
      ? (urgentTasksRes.value.data.data ?? []).map((t: Record<string, unknown>) => ({
          id: t.id, title: t.title, priority: t.priority, dueDate: t.dueDate, status: t.status,
        }))
      : [];
    const unreadNotifications = notifRes.status === 'fulfilled' ? notifRes.value.data.data?.count ?? 0 : 0;

    // Lean user payload for mobile
    const user = rawUser ? {
      id: rawUser.id,
      name: rawUser.name,
      firstName: rawUser.name?.split(' ')[0],
      avatar: rawUser.avatar,
    } : null;

    return res.json({
      success: true,
      data: { user, taskStats, urgentTasks, unreadNotifications },
    });
  } catch (error) { next(error); }
}

/**
 * Mobile task feed — paginated, minimal fields, optimised for list rendering
 */
export async function getMobileTaskFeed(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const taskRes = await taskClient(req.token!).get(`/api/tasks?${query}`);
    if (!taskRes.data.success) return res.status(502).json(taskRes.data);

    // Strip heavy fields for mobile list view
    const tasks = (taskRes.data.data ?? []).map((t: Record<string, unknown>) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      assigneeId: t.assigneeId,
      tags: t.tags,
      updatedAt: t.updatedAt,
    }));

    return res.json({ success: true, data: tasks, pagination: taskRes.data.pagination });
  } catch (error) { next(error); }
}
