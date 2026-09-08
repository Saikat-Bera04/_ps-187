import { Request, Response, NextFunction } from 'express';
import { WatchlistService } from '../services/watchlist.service';
import { AuditService } from '../services/audit.service';
import { firstQueryValue } from '../utils/request';

export class WatchlistController {
  // Persons
  static async getPersons(req: Request, res: Response, next: NextFunction) {
    try {
      const page = firstQueryValue(req.query.page);
      const limit = firstQueryValue(req.query.limit);
      const result = await WatchlistService.getPersons({ status: firstQueryValue(req.query.status), page: page ? parseInt(page, 10) : undefined, limit: limit ? parseInt(limit, 10) : undefined });
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
      const updated = await WatchlistService.updatePerson(String(req.params.id), req.body);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistPerson', resourceId: String(req.params.id), details: 'Person updated', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: updated });
    } catch (error) { next(error); }
  }

  static async deletePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.deletePerson(String(req.params.id));
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistPerson', resourceId: String(req.params.id), details: 'Person removed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // Vehicles
  static async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const page = firstQueryValue(req.query.page);
      const limit = firstQueryValue(req.query.limit);
      const result = await WatchlistService.getVehicles({ status: firstQueryValue(req.query.status), page: page ? parseInt(page, 10) : undefined, limit: limit ? parseInt(limit, 10) : undefined });
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
      const updated = await WatchlistService.updateVehicle(String(req.params.id), req.body);
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistVehicle', resourceId: String(req.params.id), details: 'Vehicle updated', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: updated });
    } catch (error) { next(error); }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WatchlistService.deleteVehicle(String(req.params.id));
      await AuditService.log({ userId: req.user!.id, action: 'WATCHLIST_UPDATED', resource: 'WatchlistVehicle', resourceId: String(req.params.id), details: 'Vehicle removed', ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
