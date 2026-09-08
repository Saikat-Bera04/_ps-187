import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';
import { AuditService } from '../services/audit.service';

export class AlertController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.getAll({
        bopId: req.query.bopId as string,
        severity: req.query.severity as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AlertService.getById(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async acknowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.acknowledge(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'ALERT_ACKNOWLEDGED', resource: 'Alert',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.resolve(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'ALERT_RESOLVED', resource: 'Alert',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async escalate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AlertService.escalate(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
