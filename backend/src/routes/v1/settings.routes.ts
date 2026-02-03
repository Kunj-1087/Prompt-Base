import { Router } from 'express';
import { changePassword, updateNotifications, getSessions, exportAccountData, deleteAccount } from '../../controllers/settings.controller';
import { updateMe } from '../../controllers/user.controller'; // Reusing existing profile update
import { protect } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(protect);

router.patch('/profile', asyncHandler(updateMe));
router.patch('/password', asyncHandler(changePassword));
router.patch('/notifications', asyncHandler(updateNotifications));
router.get('/sessions', asyncHandler(getSessions));
router.post('/export-data', asyncHandler(exportAccountData));
router.delete('/account', asyncHandler(deleteAccount));

export default router;
