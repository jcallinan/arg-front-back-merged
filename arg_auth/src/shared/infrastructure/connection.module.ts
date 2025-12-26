import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConnectionService } from "./connection.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {} 