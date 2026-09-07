import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());

router.get('/', requirePermission('alert:read'), AlertController.getAll);
router.get('/:id', requirePermission('alert:read'), AlertController.getById);

router.patch('/:id/acknowledge', requirePermission('alert:acknowledge'), AlertController.acknowledge);
router.patch('/:id/resolve', requirePermission('alert:resolve'), AlertController.resolve);
router.patch('/:id/escalate', requirePermission('alert:escalate'), AlertController.escalate);

export default router;
