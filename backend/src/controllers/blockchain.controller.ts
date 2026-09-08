import { Request, Response, NextFunction } from 'express';
import { BlockchainService } from '../services/blockchain.service';
import { AuditService } from '../services/audit.service';

export class BlockchainController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BlockchainService.registerEvidence(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'BLOCKCHAIN_REGISTERED', resource: 'Evidence',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BlockchainService.getEvidenceRecord(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BlockchainService.verifyEvidence(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async history(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BlockchainService.getEvidenceHistory(req.params.id) }); }
    catch (error) { next(error); }
  }
}
