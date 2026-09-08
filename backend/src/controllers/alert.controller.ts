import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';
import { AuditService } from '../services/audit.service';
import { firstQueryValue } from '../utils/request';

export class AlertController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.getAll({
        bopId: firstQueryValue(req.query.bopId),
        severity: firstQueryValue(req.query.severity),
        status: firstQueryValue(req.query.status),
        page: firstQueryValue(req.query.page) ? parseInt(firstQueryValue(req.query.page)!, 10) : undefined,
        limit: firstQueryValue(req.query.limit) ? parseInt(firstQueryValue(req.query.limit)!, 10) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AlertService.getById(String(req.params.id)) }); }
    catch (error) { next(error); }
  }

  static async acknowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.acknowledge(String(req.params.id));
      await AuditService.log({
        userId: req.user!.id, action: 'ALERT_ACKNOWLEDGED', resource: 'Alert',
        resourceId: String(req.params.id), ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.resolve(String(req.params.id));
      await AuditService.log({
        userId: req.user!.id, action: 'ALERT_RESOLVED', resource: 'Alert',
        resourceId: String(req.params.id), ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async escalate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.escalate(String(req.params.id));
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
