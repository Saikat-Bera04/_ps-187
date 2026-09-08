import { createServer } from 'http';
import app from './app';
import { config } from './config';
import { initWebSocket } from './websocket/socket';
import { FabricClient } from './integrations/blockchain/fabric-client';

const server = createServer(app);

// Initialize WebSocket server
initWebSocket(server);

server.listen(config.port, async () => {
  console.log(`[Server] Started on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`[Swagger] Docs available at http://localhost:${config.port}/api/docs`);
  console.log(`[Blockchain] Mode: ${config.blockchainMode}`);

  // Connect to Hyperledger Fabric if configured
  if (config.blockchainMode === 'fabric') {
    try {
      await FabricClient.connect();
    } catch (error) {
      console.error('[Fabric] Failed to connect on startup — blockchain operations will fail:', error);
    }
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  FabricClient.disconnect();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  FabricClient.disconnect();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
