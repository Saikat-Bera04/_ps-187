import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async alerts(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AnalyticsService.getAlertAnalytics(req.query.startDate as string, req.query.endDate as string) }); }
    catch (error) { next(error); }
  }
  static async events(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AnalyticsService.getEventAnalytics(req.query.startDate as string, req.query.endDate as string) }); }
    catch (error) { next(error); }
  }
  static async intrusions(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AnalyticsService.getIntrusionAnalytics(req.query.startDate as string, req.query.endDate as string) }); }
    catch (error) { next(error); }
  }
  static async cameras(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AnalyticsService.getCameraAnalytics() }); }
    catch (error) { next(error); }
  }
  static async bops(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await AnalyticsService.getBopAnalytics() }); }
    catch (error) { next(error); }
  }
}
