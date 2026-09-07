import { Router } from 'express';
import { EvidenceController } from '../controllers/evidence.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { evidenceVerifyLimiter } from '../middleware/rate-limiter';

const router = Router();

router.use(authenticate());

router.get('/', requirePermission('evidence:read'), EvidenceController.getAll);
router.get('/:id', requirePermission('evidence:read'), EvidenceController.getById);

router.post('/:id/verify', requirePermission('evidence:verify'), evidenceVerifyLimiter, EvidenceController.verify);
router.get('/:id/audit', requirePermission('evidence:read'), EvidenceController.audit);

export default router;
