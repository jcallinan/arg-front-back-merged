import { Module } from "@nestjs/common";
import { MicrosoftAuthSharedService } from "./shared-services/microsoft-auth";
import { MicrosoftAuthUsecase } from "./usecases/ms-auth/microsoft-auth.usecase";
import { AuthController } from "./controllers/auth.controller";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GetAccessTokenUsecase } from "./usecases/get-access-token/get-access-token.usecase";
import { GenerateTokenSharedService } from "./shared-services/generate-token";
import { CheckUserRightsSharedService } from "./shared-services/check-user-rights";
import { ConnectionModule } from "@src/shared/infrastructure/connection.module";
import { AuthGaurd } from "./guards/auth-guard";
import { CryptoSharedService } from "./shared-services/crypto";
import { UserInfoUsecase } from "./usecases/user-info/user-info.usecase";
import { ClearUserCacheUsecase } from "./usecases/clear-user-cache/clear-user-cache.usecase";


@Module({
    imports: [
        ConfigModule, // so we can read env vars
        ConnectionModule, // for database connection
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>(
                    "JWT_SECRET",
                    "Qz!8p#92aN*4r@7LfYwZ0u&dVb!eGkXh" // fallback secret for dev
                ),
                signOptions: { expiresIn: '24h' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [


        //shared Services,
        MicrosoftAuthSharedService,
        GenerateTokenSharedService,
        CheckUserRightsSharedService,
        CryptoSharedService,

        //Usecase
        MicrosoftAuthUsecase,
        GetAccessTokenUsecase,
        UserInfoUsecase,
        ClearUserCacheUsecase,

        //Guards
        AuthGaurd,


    ],
    exports: [JwtModule]
})
export class AuthenticationModule { }
