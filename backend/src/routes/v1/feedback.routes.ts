import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
} from '../../controllers/feedback.controller';
import { validate } from '../../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation schema
const createFeedbackSchema = z.object({
  body: z.object({
    type: z.enum(['bug', 'feature_request', 'improvement', 'general', 'complaint']),
    category: z.string().optional(),
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    rating: z.number().min(1).max(5).optional(),
    email: z.string().email().optional(),
    screenshot: z.string().url().optional(),
  }),
});

const updateFeedbackSchema = z.object({
  body: z.object({
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    status: z.enum(['new', 'in_review', 'planned', 'in_progress', 'completed', 'rejected']).optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    adminNotes: z.string().max(2000).optional(),
  }),
});

// Public endpoint (can submit feedback without auth)
router.post('/', validate(createFeedbackSchema), createFeedback);

// Protected endpoints
router.use(protect);

router.get('/my-feedback', getMyFeedback);
router.get('/stats', restrictTo('admin'), getFeedbackStats);
router.get('/:id', getFeedbackById);

// Admin only
router.get('/', restrictTo('admin'), getAllFeedback);
router.patch('/:id', restrictTo('admin'), validate(updateFeedbackSchema), updateFeedback);
router.delete('/:id', restrictTo('admin'), deleteFeedback);

export default router;
