import { Router } from 'express';
import { getMe, updateMe, updateAvatar } from '../../controllers/user.controller';
import { protect } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Apply protection to all routes
router.use(protect);

router.get('/me', asyncHandler(getMe));
router.put('/me', asyncHandler(updateMe));
router.patch('/me/avatar', asyncHandler(updateAvatar));

export default router;
