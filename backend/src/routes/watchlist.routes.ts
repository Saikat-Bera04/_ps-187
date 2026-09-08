import { Router } from 'express';
import { WatchlistController } from '../controllers/watchlist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate());

// Persons
router.get('/persons', requirePermission('watchlist:read'), WatchlistController.getPersons);
router.post('/persons', requirePermission('watchlist:create'), WatchlistController.createPerson);
router.patch('/persons/:id', requirePermission('watchlist:update'), WatchlistController.updatePerson);
router.delete('/persons/:id', requirePermission('watchlist:delete'), WatchlistController.deletePerson);

// Vehicles
router.get('/vehicles', requirePermission('watchlist:read'), WatchlistController.getVehicles);
router.post('/vehicles', requirePermission('watchlist:create'), WatchlistController.createVehicle);
router.patch('/vehicles/:id', requirePermission('watchlist:update'), WatchlistController.updateVehicle);
router.delete('/vehicles/:id', requirePermission('watchlist:delete'), WatchlistController.deleteVehicle);

export default router;
