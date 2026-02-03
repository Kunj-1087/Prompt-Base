import { Router } from 'express';
import { getDashboardStats, getRecentActivity, getDashboardSummary } from '../../controllers/dashboard.controller';
import { protect } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(protect);

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/activity', asyncHandler(getRecentActivity));
router.get('/summary', asyncHandler(getDashboardSummary));

export default router;
