import { Router } from 'express';
import { getComments, addComment, deleteComment } from '../controllers/comment.controller';

const router = Router();

router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', addComment);
router.delete('/:taskId/comments/:commentId', deleteComment);

export default router;
