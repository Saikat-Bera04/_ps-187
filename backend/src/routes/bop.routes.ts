import { Router } from 'express';
import { BopController } from '../controllers/bop.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate';
import { createBopSchema, updateBopSchema } from '../validators/bop.validators';

const router = Router();

router.use(authenticate());

router.get('/', requirePermission('bop:read'), BopController.getAll);
router.get('/:id', requirePermission('bop:read'), BopController.getById);

router.post('/', requirePermission('bop:create'), validate(createBopSchema), BopController.create);
router.patch('/:id', requirePermission('bop:update'), validate(updateBopSchema), BopController.update);
router.delete('/:id', requirePermission('bop:delete'), BopController.delete);

export default router;
