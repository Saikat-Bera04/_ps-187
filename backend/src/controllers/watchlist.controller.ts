import { Request, Response, NextFunction } from 'express';
import { WatchlistService } from '../services/watchlist.service';
import { AuditService } from '../services/audit.service';

export class WatchlistController {
  // Persons
  static async getPersons(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.getPersons({ status: req.query.status as string, page: req.query.page ? parseInt(req.query.page as string) : undefined, limit: req.query.limit ? parseInt(req.query.limit as string) : undefined });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async createPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const person = await WatchlistService.createPerson({ ...req.body, addedBy: req.user!.name });
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistPerson', resourceId: person.referenceId, details: 'Person added', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.status(201).json({ success: true, data: person });
    } catch (error) { next(error); }
  }

  static async updatePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await WatchlistService.updatePerson(req.params.id, req.body);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistPerson', resourceId: req.params.id, details: 'Person updated', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: updated });
    } catch (error) { next(error); }
  }

  static async deletePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.deletePerson(req.params.id);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistPerson', resourceId: req.params.id, details: 'Person removed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // Vehicles
  static async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.getVehicles({ status: req.query.status as string, page: req.query.page ? parseInt(req.query.page as string) : undefined, limit: req.query.limit ? parseInt(req.query.limit as string) : undefined });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await WatchlistService.createVehicle({ ...req.body, addedBy: req.user!.name });
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistVehicle', resourceId: vehicle.vehicleId, details: 'Vehicle added', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.status(201).json({ success: true, data: vehicle });
    } catch (error) { next(error); }
  }

  static async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await WatchlistService.updateVehicle(req.params.id, req.body);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistVehicle', resourceId: req.params.id, details: 'Vehicle updated', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: updated });
    } catch (error) { next(error); }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.deleteVehicle(req.params.id);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistVehicle', resourceId: req.params.id, details: 'Vehicle removed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
