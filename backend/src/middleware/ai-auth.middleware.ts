import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { AppError } from '../utils/app-error';

/** Service-to-service auth for the Python ML pipeline. */
export function authenticateAiService() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-ai-api-key'] as string | undefined;
    if (!apiKey || apiKey !== config.aiApiKey) {
      next(AppError.unauthorized('Invalid AI service API key'));
      return;
    }
    next();
  };
}
