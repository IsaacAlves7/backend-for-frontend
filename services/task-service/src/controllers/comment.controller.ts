import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const commentSchema = z.object({ content: z.string().min(1).max(2000) });

export async function getComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.taskId },
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ success: true, data: comments });
  } catch (error) { next(error); }
}

export async function addComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = commentSchema.parse(req.body);
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const comment = await prisma.comment.create({
      data: { content: body.content, taskId: req.params.taskId, userId: req.userId! },
    });
    return res.status(201).json({ success: true, data: comment });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });
    await prisma.comment.delete({ where: { id: req.params.commentId } });
    return res.json({ success: true, message: 'Comment deleted' });
  } catch (error) { next(error); }
}
