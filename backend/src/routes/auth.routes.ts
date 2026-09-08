import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limiter';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  refreshSchema,
} from '../validators/auth.validators';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), AuthController.verifyEmail);
router.post('/resend-verification', authLimiter, validate(resendVerificationSchema), AuthController.resendVerification);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);

router.post('/logout', authenticate(), AuthController.logout);
router.get('/me', authenticate(), AuthController.me);

export default router;
