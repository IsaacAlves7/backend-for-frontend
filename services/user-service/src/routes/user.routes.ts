import { Router } from 'express';
import { getMe, getUserById, createOrUpdateUser, updateUser, deleteUser, searchUsers } from '../controllers/user.controller';

const router = Router();

router.get('/me', getMe);
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.post('/', createOrUpdateUser);
router.patch('/me', updateUser);
router.delete('/me', deleteUser);

export default router;
