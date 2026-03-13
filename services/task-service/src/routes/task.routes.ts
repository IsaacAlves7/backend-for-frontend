import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats } from '../controllers/task.controller';

const router = Router();

router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
