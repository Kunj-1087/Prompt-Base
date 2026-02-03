import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, refresh, logout, checkEmail, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../../controllers/auth.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many auth requests from this IP, please try again after 15 minutes',
});

const resendLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // 1 request per minute
    message: 'Please wait a minute before requesting another verification email'
});

router.post('/signup', authLimiter, asyncHandler(signup));
router.post('/login', authLimiter, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
console.log('Registering check-email route');
router.post('/check-email', asyncHandler(checkEmail));
router.post('/forgot-password', authLimiter, asyncHandler(forgotPassword));
router.post('/reset-password', authLimiter, asyncHandler(resetPassword));

// Verification Routes
router.post('/verify-email/:token', asyncHandler(verifyEmail));
router.post('/resend-verification', protect, resendLimiter, asyncHandler(resendVerification));

export default router;
