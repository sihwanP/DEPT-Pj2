import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController';

const router = Router();

// These should ideally be protected by an admin middleware
router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
