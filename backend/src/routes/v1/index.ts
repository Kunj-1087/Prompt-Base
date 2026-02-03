import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import dashboardRoutes from './dashboard.routes';
import settingsRoutes from './settings.routes';
// import uploadRoutes from './upload.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/2fa', twoFactorRoutes);
router.use('/sessions', sessionRoutes);
router.use('/prompts', promptRoutes);
// router.use('/upload', uploadRoutes);

export default router;
