import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { authId: req.userId! } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function createOrUpdateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.upsert({
      where: { authId: req.userId! },
      update: { name, email },
      create: { authId: req.userId!, name, email },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = updateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { authId: req.userId! },
      data: body,
    });
    return res.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await prisma.user.delete({ where: { authId: req.userId! } });
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
}

export async function searchUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q ?? '');
    const users = await prisma.user.findMany({
      where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] },
      take: 20,
      select: { id: true, name: true, email: true, avatar: true },
    });
    return res.json({ success: true, data: users });
  } catch (error) { next(error); }
}
