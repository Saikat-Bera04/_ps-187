import { createServer } from 'http';
import app from './app';
import { config } from './config';
import { initWebSocket } from './websocket/socket';

const server = createServer(app);

// Initialize WebSocket server
initWebSocket(server);

server.listen(config.port, () => {
  console.log(`[Server] Started on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`[Swagger] Docs available at http://localhost:${config.port}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
