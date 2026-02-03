import express from 'express';
import { getActivities } from '../../controllers/activity.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);

export default router;
