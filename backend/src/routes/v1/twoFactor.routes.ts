import { Router } from 'express';
import { setup2FA, verifySetup, disable2FA } from '../../controllers/twoFactor.controller';
import { protect } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(protect);

router.post('/setup', asyncHandler(setup2FA));
router.post('/verify-setup', asyncHandler(verifySetup));
router.post('/disable', asyncHandler(disable2FA));

export default router;
