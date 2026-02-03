import { Router } from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../../controllers/admin.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Protect all routes
router.use(protect);
// Restrict to Admin only
router.use(authorize('admin'));

router.get('/users', asyncHandler(getAllUsers));
router.put('/users/:id/role', asyncHandler(updateUserRole));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
