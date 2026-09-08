import { Router } from 'express';
import { BlockchainController } from '../controllers/blockchain.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());

router.post('/evidence/:id', requirePermission('blockchain:register'), BlockchainController.register);
router.get('/evidence/:id', requirePermission('blockchain:read'), BlockchainController.get);
router.post('/evidence/:id/verify', requirePermission('blockchain:verify'), BlockchainController.verify);
router.get('/evidence/:id/history', requirePermission('blockchain:read'), BlockchainController.history);

export default router;
