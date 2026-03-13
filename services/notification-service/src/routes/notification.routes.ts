import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotifications, createNotification,
  markAsRead, markAllAsRead, getUnreadCount,
} from '../controllers/notification.controller';

const router = Router();

router.post('/', authenticate, createNotification);
router.get('/', authenticate, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/read-all', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);

export default router;
