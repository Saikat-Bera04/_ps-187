import { Request, Response, NextFunction } from 'express';
import { EvidenceService } from '../services/evidence.service';
import { AuditService } from '../services/audit.service';

export class EvidenceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EvidenceService.getAll({
        bopId: req.query.bopId as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const evidence = await EvidenceService.getById(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'EVIDENCE_VIEWED', resource: 'Evidence',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: evidence });
    } catch (error) { next(error); }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EvidenceService.verify(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'EVIDENCE_VERIFIED', resource: 'Evidence',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async audit(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await EvidenceService.getAuditTrail(req.params.id) }); }
    catch (error) { next(error); }
  }
}
