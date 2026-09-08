import { Request, Response, NextFunction } from 'express';
import { AiService } from '../services/ai.service';

export class AiController {
  static async ingestEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.ingestEvent(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
