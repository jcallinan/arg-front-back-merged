import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { BullModule } from "@nestjs/bull";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { WebsocketModule } from "@src/shared/websocket/websocket.module";
import { redis_connection } from "@src/shared/queue/bullmq-connection";
import { AccountPayableModule } from "./main/account-payable/account-payable.module";
import { GlobalStatesModule } from "./main/global-states/global-states.module";
import { CacheModule } from "./shared/cache/cache.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: process.env.FILE_ROOTH_PATH ?? '/srv/samba/share/G-Drive', // Absolute path to the folder where static files are stored
      serveRoot: process.env.FILE_SERVE_ROOT ?? '/G-Drive', // URL prefix to serve the static files from
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'dev'}`],
    }),
    CacheModule,
    AuthModule,
    AccountPayableModule,
    GlobalStatesModule,
    BullModule.forRoot({
      redis: redis_connection,
    }),
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule { }
