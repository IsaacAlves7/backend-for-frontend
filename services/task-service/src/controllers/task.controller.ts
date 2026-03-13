import { Response, NextFunction } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { TaskStatus, TaskPriority, Prisma } from '@prisma/client';

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:4004';

// ─── Schemas ─────────────────────────────────────────────────────────────────
const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function notifyAssignment(taskId: string, taskTitle: string, assigneeId: string, actorId: string) {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
      userId: assigneeId,
      type: 'TASK_ASSIGNED',
      title: 'New task assigned to you',
      message: `You were assigned to: "${taskTitle}"`,
      metadata: { taskId, actorId },
    }, { headers: { 'x-service-key': process.env.SERVICE_KEY ?? 'internal' } });
  } catch {
    // Non-critical — log and continue
    console.warn('Failed to send assignment notification');
  }
}

// ─── Controllers ─────────────────────────────────────────────────────────────
export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status, priority, search, page = '1', limit = '20', assignedToMe } = req.query;

    const where: Prisma.TaskWhereInput = {
      OR: [{ userId: req.userId! }, { assigneeId: req.userId! }],
    };

    if (assignedToMe === 'true') where.assigneeId = req.userId!;
    if (status) where.status = status as TaskStatus;
    if (priority) where.priority = priority as TaskPriority;
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({ where, skip, take: limitNum, orderBy: { updatedAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);

    return res.json({
      success: true,
      data: tasks,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) { next(error); }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { comments: { orderBy: { createdAt: 'desc' } } },
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.userId !== req.userId && task.assigneeId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return res.json({ success: true, data: task });
  } catch (error) { next(error); }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...body,
        userId: req.userId!,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        tags: body.tags ?? [],
      },
    });

    if (task.assigneeId && task.assigneeId !== req.userId) {
      await notifyAssignment(task.id, task.title, task.assigneeId, req.userId!);
    }

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = updateTaskSchema.parse(req.body);
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Task not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { ...body, dueDate: body.dueDate ? new Date(body.dueDate) : undefined },
    });

    // Notify new assignee if changed
    if (body.assigneeId && body.assigneeId !== existing.assigneeId && body.assigneeId !== req.userId) {
      await notifyAssignment(task.id, task.title, body.assigneeId, req.userId!);
    }

    return res.json({ success: true, data: task });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Task not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });
    await prisma.task.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Task deleted' });
  } catch (error) { next(error); }
}

export async function getTaskStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const where = { OR: [{ userId: req.userId! }, { assigneeId: req.userId! }] };
    const [total, todo, inProgress, review, done] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: 'TODO' } }),
      prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...where, status: 'REVIEW' } }),
      prisma.task.count({ where: { ...where, status: 'DONE' } }),
    ]);
    return res.json({ success: true, data: { total, todo, inProgress, review, done } });
  } catch (error) { next(error); }
}
