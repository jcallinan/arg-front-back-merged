import { Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { WebsocketGateway } from "./websocket.gateway";

@Injectable()
export class WebsocketService {
  private readonly logger = new AppLogger(WebsocketService.name);
  constructor(private readonly gateway: WebsocketGateway) {}

  emitUploadStatus(event: string, data: any) {
    this.gateway.emitEvent(event, data);
    this.logger.log(`Emitting event: ${event} with ${data}`);
  }


}
