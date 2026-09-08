import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export let io: Server;

export function initWebSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: config.corsOrigin, methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.data.user.email}`);
    
    socket.on('join_bop', (bopId: string) => {
      // Basic authorization checking could go here
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
  } else {
    io.emit(event, data);
  }
}
