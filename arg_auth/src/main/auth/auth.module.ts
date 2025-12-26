import { Module } from "@nestjs/common";
import { DataModule } from "./data/data.module";
import { AuthenticationModule } from "./application/authentication.module";


@Module({
    imports: [
        DataModule,
        AuthenticationModule,
    ],
    exports: [
        AuthenticationModule
    ],
})
export class AuthModule { } 