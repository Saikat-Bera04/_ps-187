import { Request, Response, NextFunction } from 'express';
import { AiService } from '../services/ai.service';
import { CameraService } from '../services/camera.service';

export class AiController {
  static async ingestEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.ingestEvent(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async reportCameraStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CameraService.reportAiStatus(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
