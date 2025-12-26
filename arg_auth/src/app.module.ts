import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { JwtModule } from '@nestjs/jwt';
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { WebsocketModule } from "@src/shared/websocket/websocket.module";
import { CacheModule } from "./shared/cache/cache.module";
import { AuthModule } from "./main/auth/auth.module";
import { ConnectionModule } from "./shared/infrastructure/connection.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    ConnectionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Qz!8p#92aN*4r@7LfYwZ0u&dVb!eGkXh', // use env vars in production
      signOptions: { expiresIn: '24h' }, // default expiry
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.FILE_ROOTH_PATH ?? '/srv/samba/share/G-Drive', // Absolute path to the folder where static files are stored
      serveRoot: process.env.FILE_SERVE_ROOT ?? '/G-Drive', // URL prefix to serve the static files from
    }),
    CacheModule,
    AuthModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService, JwtModule],
})
export class AppModule { }
