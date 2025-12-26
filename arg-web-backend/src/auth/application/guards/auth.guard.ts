import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AuthUseCase } from "../usecases/auth.usecase";
import { AuthRequest } from "../../domain/interface/auth-request.interface";
import { AuthUser } from "../../domain/entities/auth-user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly authUseCase: AuthUseCase) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();

    // Extract token from cookies
    let accessToken = req.cookies?.["access-token"];

    // Check for Selenium Bypass
    const bypassToken = process.env.BACKEND_BYPASS_TOKEN;
    const requestBypassToken = req.headers["x-backend-bypass-token"];

    if (bypassToken && requestBypassToken === bypassToken) {
      this.logger.warn("Backend authentication bypass triggered by Selenium test");
      // Create a mock admin/superuser for testing
      req.user = new AuthUser(
        "selenium@test.com",
        "selenium-bypass-id",
        "selenium_user",
        "Selenium Test User",
        "ST"
      );
      return true;
    }

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
