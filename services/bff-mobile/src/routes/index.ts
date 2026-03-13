import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMobileDashboard, getMobileTaskFeed } from '../controllers/dashboard.controller';
import {
  register, login, refresh, logout,
  getProfile, updateProfile,
  getTasks, getTaskById, createTask, updateTask, deleteTask,
  getNotifications, markNotificationRead,
} from '../controllers/proxy.controller';

const router = Router();

// Public
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

// Authenticated
router.use(authenticate);

// Mobile-specific aggregated endpoints
router.get('/dashboard', getMobileDashboard);
router.get('/tasks/feed', getMobileTaskFeed);

// Tasks
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Profile
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
