import { Request, Response, NextFunction } from 'express';
import { SystemService } from '../services/system.service';

export class SystemController {
  static async health(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await SystemService.getHealth() }); }
    catch (error) { next(error); }
  }
}
