import { Response, NextFunction } from 'express';
import { BffRequest } from '../middleware/auth.middleware';
import { userClient, taskClient, notificationClient } from '../utils/httpClient';

/**
 * Dashboard aggregation — single request returns all data the Web UI needs.
 * This is the core BFF pattern: instead of 3 round-trips from the client,
 * the BFF fans out in parallel and merges the result server-side.
 */
export async function getDashboard(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const token = req.token!;

    // Fan out to three services in parallel
    const [userRes, statsRes, recentTasksRes, notifRes] = await Promise.allSettled([
      userClient(token).get('/api/users/me'),
      taskClient(token).get('/api/tasks/stats'),
      taskClient(token).get('/api/tasks?limit=5&page=1'),
      notificationClient(token).get('/api/notifications/unread-count'),
    ]);

    const user = userRes.status === 'fulfilled' ? userRes.value.data.data : null;
    const taskStats = statsRes.status === 'fulfilled' ? statsRes.value.data.data : null;
    const recentTasks = recentTasksRes.status === 'fulfilled' ? recentTasksRes.value.data.data : [];
    const unreadNotifications = notifRes.status === 'fulfilled' ? notifRes.value.data.data?.count ?? 0 : 0;

    return res.json({
      success: true,
      data: { user, taskStats, recentTasks, unreadNotifications },
    });
  } catch (error) { next(error); }
}

/**
 * Task detail with enriched assignee profile.
 * Web UI shows task + full user card — one BFF call instead of two client calls.
 */
export async function getTaskWithAssignee(req: BffRequest, res: Response, next: NextFunction) {
  try {
    const token = req.token!;
    const { id } = req.params;

    const taskRes = await taskClient(token).get(`/api/tasks/${id}`);
    if (!taskRes.data.success) return res.status(404).json(taskRes.data);

    const task = taskRes.data.data;

    // Enrich with assignee profile if present
    let assignee = null;
    if (task.assigneeId) {
      try {
        const assigneeRes = await userClient(token).get(`/api/users/${task.assigneeId}`);
        assignee = assigneeRes.data.data;
      } catch { /* non-critical */ }
    }

    return res.json({ success: true, data: { ...task, assignee } });
  } catch (error) { next(error); }
}
