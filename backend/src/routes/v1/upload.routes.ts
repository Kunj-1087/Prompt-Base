
import { Router } from 'express';
import { uploadFile, upload } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', upload.single('file'), uploadFile);

export default router;
