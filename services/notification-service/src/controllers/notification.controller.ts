import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { NotificationType } from '@prisma/client';

const createSchema = z.object({
  userId: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  metadata: z.record(z.unknown()).optional(),
});

export async function getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const unreadOnly = req.query.unread === 'true';
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Number(req.query.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = { userId, ...(unreadOnly ? { read: false } : {}) };

    const [notifications, total, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return res.json({
      success: true,
      data: notifications,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      unreadCount,
    });
  } catch (error) { next(error); }
}

export async function createNotification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Only internal service calls or authenticated users can create
    if (!req.isServiceCall && !req.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const body = createSchema.parse(req.body);
    const notification = await prisma.notification.create({ data: body });
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    if (notification.userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    return res.json({ success: true, data: updated });
  } catch (error) { next(error); }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await prisma.notification.updateMany({ where: { userId: req.userId!, read: false }, data: { read: true } });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { next(error); }
}

export async function getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const count = await prisma.notification.count({ where: { userId: req.userId!, read: false } });
    return res.json({ success: true, data: { count } });
  } catch (error) { next(error); }
}
