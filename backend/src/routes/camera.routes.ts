import { Router } from 'express';
import { CameraController } from '../controllers/camera.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission, requireBopAccess } from '../middleware/rbac.middleware';
import { cameraControlLimiter } from '../middleware/rate-limiter';
import { validate } from '../middleware/validate';
import { createCameraSchema, updateCameraSchema } from '../validators/camera.validators';
import { CameraService } from '../services/camera.service';

const router = Router();

router.use(authenticate());

// View cameras (BOP-level authorization applies)
router.get('/', requirePermission('camera:read'), CameraController.getAll);

// Dynamic BOP authorization for single camera routes
const cameraBopAuth = requireBopAccess(async (req) => {
  return await CameraService.getCameraBopId(req.params.id);
});

router.get('/:id', requirePermission('camera:read'), cameraBopAuth, CameraController.getById);

// Create camera (needs BOP code in body for auth)
router.post(
  '/',
  requirePermission('camera:create'),
  validate(createCameraSchema),
  requireBopAccess((req) => req.body.bopCode),
  CameraController.create,
);

// Update/Delete camera
router.patch('/:id', requirePermission('camera:update'), cameraBopAuth, validate(updateCameraSchema), CameraController.update);
router.delete('/:id', requirePermission('camera:delete'), cameraBopAuth, CameraController.delete);

// Camera controls
router.post('/:id/test', requirePermission('camera:control'), cameraBopAuth, cameraControlLimiter, CameraController.test);
router.post('/:id/start', requirePermission('camera:control'), cameraBopAuth, cameraControlLimiter, CameraController.start);
router.post('/:id/stop', requirePermission('camera:control'), cameraBopAuth, cameraControlLimiter, CameraController.stop);
router.get('/:id/health', requirePermission('camera:read'), cameraBopAuth, CameraController.health);

export default router;
