import { Request, Response, NextFunction } from 'express';
import { CameraService } from '../services/camera.service';
import { AuditService } from '../services/audit.service';

export class CameraController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userBopId = req.user?.role === 'BOP_OPERATOR' ? req.user.assignedBopId : null;
      res.json({ success: true, data: await CameraService.getAll(userBopId) });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await CameraService.getById(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await CameraService.create(req.body);
      await AuditService.log({
        userId: req.user!.id, action: 'CAMERA_CREATED', resource: 'Camera',
        resourceId: camera.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.status(201).json({ success: true, data: camera });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await CameraService.update(req.params.id, req.body);
      await AuditService.log({
        userId: req.user!.id, action: 'CAMERA_UPDATED', resource: 'Camera',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: camera });
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CameraService.delete(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'CAMERA_DELETED', resource: 'Camera',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async test(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await CameraService.testConnection(req.params.id) }); }
    catch (error) { next(error); }
  }

  static async start(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CameraService.start(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'CAMERA_STARTED', resource: 'Camera',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CameraService.stop(req.params.id);
      await AuditService.log({
        userId: req.user!.id, action: 'CAMERA_STOPPED', resource: 'Camera',
        resourceId: req.params.id, ipAddress: req.ip, userAgent: req.headers['user-agent'],
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async health(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: await CameraService.getHealth(req.params.id) }); }
    catch (error) { next(error); }
  }
}
