import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../config/database';

const COMMAND_ROLES = new Set(['SUPER_ADMIN', 'COMMANDER', 'ANALYST', 'INVESTIGATOR', 'AUDITOR']);

export let io: Server;

export function initWebSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: config.corsOrigin, methods: ['GET', 'POST'] },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          assignedBop: { select: { code: true } },
        },
      });
      if (!user?.isActive) return next(new Error('Authentication error'));

      socket.data.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        bopCode: user.assignedBop?.code || null,
      };
      if (user.assignedBop?.code) socket.join(`bop:${user.assignedBop.code}`);
      if (COMMAND_ROLES.has(user.role)) socket.join('command');
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.data.user.email}`);

    socket.on('join_bop', (bopId: string) => {
      const user = socket.data.user as { role: string; bopCode: string | null };
      if (!COMMAND_ROLES.has(user.role) && user.bopCode !== bopId) {
        socket.emit('socket_error', { message: 'Not authorized for this BOP' });
        return;
      }
      socket.join(`bop:${bopId}`);
    });

    socket.on('leave_bop', (bopId: string) => {
      socket.leave(`bop:${bopId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.data.user.email}`);
    });
  });
}

export function emitEvent(event: string, data: any, bopId?: string) {
  if (!io) return;
  if (bopId) {
    io.to(`bop:${bopId}`).emit(event, data);
    io.to('command').emit(event, data);
  } else {
    io.emit(event, data);
  }
}
