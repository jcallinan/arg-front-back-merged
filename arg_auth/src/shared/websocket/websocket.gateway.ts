import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { cacheConfig } from "@src/shared/cache/cache.config";
 
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class WebsocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;
 
  private readonly logger = new Logger(WebsocketGateway.name);
 
  async afterInit() {
    this.logger.log('WebSocket Gateway initialized');
 
    // Configure Redis adapter for PM2 clustering
    try {
      const redisUrl = cacheConfig.password
        ? `redis://:${cacheConfig.password}@${cacheConfig.host}:${cacheConfig.port}/${cacheConfig.db}`
        : `redis://${cacheConfig.host}:${cacheConfig.port}/${cacheConfig.db}`;
 
      const pubClient = createClient({
        url: redisUrl
      });
 
      const subClient = pubClient.duplicate();
 
      await Promise.all([pubClient.connect(), subClient.connect()]);
 
      this.server.adapter(createAdapter(pubClient, subClient));
      this.logger.log('✅ Redis adapter configured for Socket.IO clustering');
    } catch (error) {
      this.logger.error('❌ Failed to configure Redis adapter:', error);
    }
  }
 
  emitEvent(event: string, data: any) {
    try {
      if (!this.server) {
        this.logger.error(`❌ Socket.IO server is not initialized`);
        return;
      }

      this.logger.log(`📢 Emitting event '${event}' with data: ${JSON.stringify(data)}`);
      this.server.emit(event, data);
    } catch (error: unknown) {
      this.logger.error(`❌ Failed to emit event '${event}': ${error}`);
    }
  }
}
 