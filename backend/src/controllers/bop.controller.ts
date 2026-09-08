import { Request, Response, NextFunction } from 'express';
import { BopService } from '../services/bop.service';
import { AuditService } from '../services/audit.service';

export class BopController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BopService.getAll() }); }
    catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BopService.getById(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bop = await BopService.create(req.body);
      res.status(201).json({ success: true, data: bop });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BopService.update(req.params.id, req.body) }); }
    catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await BopService.delete(req.params.id) }); }
    catch (error) { next(error); }
  }
}
