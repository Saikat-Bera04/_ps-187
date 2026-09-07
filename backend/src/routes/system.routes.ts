import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());

router.get('/health', requirePermission('system:read'), SystemController.health);

export default router;
