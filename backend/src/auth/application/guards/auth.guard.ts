import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AuthUseCase } from "../usecases/auth.usecase";
import { AuthRequest } from "../../domain/interface/auth-request.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly authUseCase: AuthUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();

    // Extract token from cookies
    let accessToken = req.cookies?.["access-token"];


    if (!accessToken) {
      const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    const path = req.route?.path?.replace(/^\/v\d+\//, '/') || '/'; 
    const method = req.method; 

    this.logger.log("accessToken:", accessToken);
    this.logger.log("path:", path);

    const user = await this.authUseCase.execute(accessToken, path, method);

    req.user = user;
    return true;
  }
}
