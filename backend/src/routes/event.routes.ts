import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());

router.get('/', requirePermission('event:read'), EventController.getAll);
router.get('/:id', requirePermission('event:read'), EventController.getById);
router.post('/', requirePermission('event:create'), EventController.create);

export default router;
