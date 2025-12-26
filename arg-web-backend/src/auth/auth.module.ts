import { Module } from "@nestjs/common";
import { AuthUseCase } from "./application/usecases/auth.usecase";
import { AuthGuard } from "./application/guards/auth.guard";

@Module({
  providers: [AuthUseCase, AuthGuard],
  exports: [AuthGuard, AuthUseCase],
})
export class AuthModule {}
