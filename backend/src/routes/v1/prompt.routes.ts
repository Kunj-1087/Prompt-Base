import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  restorePrompt,
  searchPrompts,
  getSuggestions
} from '../controllers/prompt.controller';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation Schemas
const createPromptSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' })
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters'),
    description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
    status: z.enum(['draft', 'active', 'completed', 'archived'], {
        invalid_type_error: "Status must be one of: 'draft', 'active', 'completed', 'archived'"
    }).optional(),
    priority: z.enum(['low', 'medium', 'high'], {
        invalid_type_error: "Priority must be one of: 'low', 'medium', 'high'"
    }).optional(),
    tags: z.array(z.string(), {
        invalid_type_error: "Tags must be an array of strings"
    }).optional(),
    metadata: z.record(z.any()).optional()
  }),
});

const updatePromptSchema = z.object({
    body: z.object({
      title: z.string().min(3).max(200).optional(),
      description: z.string().max(5000).optional(),
      status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      tags: z.array(z.string()).optional(),
      metadata: z.record(z.any()).optional()
    }),
  });

router.use(protect);

router.route('/')
  .post(validate(createPromptSchema), createPrompt)
  .get(getPrompts);

router.get('/search', searchPrompts);
router.get('/suggestions', getSuggestions);

router.route('/:id')
  .get(getPromptById)
  .patch(validate(updatePromptSchema), updatePrompt)
  .delete(deletePrompt);

router.post('/:id/restore', restorePrompt);

export default router;
