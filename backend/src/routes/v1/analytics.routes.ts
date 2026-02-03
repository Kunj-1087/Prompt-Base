import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import {
  trackEvent,
  getStats,
  getFunnel,
  getRetention,
  getPerformanceMetrics,
  getErrorRate,
  getFeatureUsage,
} from '../../controllers/analytics.controller';

const router = Router();

// Public endpoint for tracking events (can be called without auth for anonymous tracking)
router.post('/track', trackEvent);

// Protected endpoints for viewing analytics
router.use(protect);

router.get('/stats', getStats);
router.get('/funnel', getFunnel);
router.get('/retention', restrictTo('admin'), getRetention);
router.get('/performance', restrictTo('admin'), getPerformanceMetrics);
router.get('/error-rate', restrictTo('admin'), getErrorRate);
router.get('/feature-usage', restrictTo('admin'), getFeatureUsage);

export default router;
