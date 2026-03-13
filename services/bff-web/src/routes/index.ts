import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { getDashboard, getTaskWithAssignee } from '../controllers/dashboard.controller';
import {
  getTasks, createTask, updateTask, deleteTask,
  searchUsers, getNotifications, markNotificationRead,
  markAllNotificationsRead, getProfile, updateProfile,
} from '../controllers/proxy.controller';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

// ─── Authenticated ────────────────────────────────────────────────────────────
router.use(authenticate);

// Aggregated BFF endpoints (key value of BFF pattern)
router.get('/dashboard', getDashboard);
router.get('/tasks/:id/detail', getTaskWithAssignee);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Users
router.get('/users/search', searchUsers);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
