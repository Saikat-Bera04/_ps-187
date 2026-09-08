import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EventService.getAll({
        cameraId: req.query.cameraId as string,
        bopId: req.query.bopId as string,
        eventType: req.query.eventType as string,
        severity: req.query.severity as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await EventService.getById(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.create(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) { next(error); }
  }
}
