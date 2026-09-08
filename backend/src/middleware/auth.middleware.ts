import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  assignedBopId: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Authenticate middleware: validates JWT and attaches user to request.
 */
export function authenticate() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppError.unauthorized('Authentication token required');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        email: string;
        role: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          assignedBopId: true,
        },
      });

      if (!user) {
        throw AppError.unauthorized('User not found');
      }

      if (!user.isActive) {
        throw AppError.forbidden('Account is deactivated');
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        assignedBopId: user.assignedBopId,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(AppError.unauthorized('Invalid authentication token'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(AppError.unauthorized('Authentication token expired'));
      } else {
        next(AppError.unauthorized('Authentication failed'));
      }
    }
  };
}
