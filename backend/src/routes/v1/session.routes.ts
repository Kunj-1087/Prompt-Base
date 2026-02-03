import { Router } from 'express';
import { getSessions, revokeSession, revokeAllSessions } from '../../controllers/session.controller';
import { protect } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(protect);

router.get('/', asyncHandler(getSessions));
router.delete('/all', asyncHandler(revokeAllSessions));
router.delete('/:id', asyncHandler(revokeSession));

export default router;
