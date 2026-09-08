import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { firstQueryValue } from '../utils/request';

export class EventController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EventService.getAll({
        cameraId: firstQueryValue(req.query.cameraId),
        bopId: firstQueryValue(req.query.bopId),
        eventType: firstQueryValue(req.query.eventType),
        severity: firstQueryValue(req.query.severity),
        startDate: firstQueryValue(req.query.startDate),
        endDate: firstQueryValue(req.query.endDate),
        page: firstQueryValue(req.query.page) ? parseInt(firstQueryValue(req.query.page)!, 10) : undefined,
        limit: firstQueryValue(req.query.limit) ? parseInt(firstQueryValue(req.query.limit)!, 10) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await EventService.getById(String(req.params.id)) }); }
    catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.create(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) { next(error); }
  }
}
