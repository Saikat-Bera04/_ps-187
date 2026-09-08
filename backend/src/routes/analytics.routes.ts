import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());
router.use(requirePermission('analytics:read'));

router.get('/overview', AnalyticsController.overview);
router.get('/alerts', AnalyticsController.alerts);
router.get('/events', AnalyticsController.events);
router.get('/intrusions', AnalyticsController.intrusions);
router.get('/cameras', AnalyticsController.cameras);
router.get('/bops', AnalyticsController.bops);

export default router;
