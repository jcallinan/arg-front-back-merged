import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { AuthModule } from '@src/auth/auth.module';
@Module({
  imports: [AuthModule],  // make sure to import AuthModule
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService]  // so other modules can inject
})
export class WebsocketModule {}
