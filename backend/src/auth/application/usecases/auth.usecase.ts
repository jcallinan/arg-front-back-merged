import {
  Injectable,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthUser } from "../../domain/entities/auth-user.entity";
import { Api } from "../../../api-schema/auth/api";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);
  private readonly baseUrl = process.env.ARG_AUTH_BASE_URL;
  private readonly authApi: Api<unknown>;
  private readonly timeoutMs: number;

  constructor() {
    this.authApi = new Api({ baseUrl: this.baseUrl });
    this.timeoutMs = Number(15000); // 15 sec
  }

  async execute(accessToken?: string, path?: string, method?: string): Promise<AuthUser> {
    if (!accessToken) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
          {
            field: "Authentication failed",
            code: ERROR_CONSTANTS.UNAUTHORIZED.code,
            message: "Token not found in cookie or Authorization header",
          },
        ]),
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      const restApi = true;
      const user = await this.callAuthService(accessToken, path, method, restApi);

      if (!user.isValid()) {
        throw new UnauthorizedException(
          "Invalid user payload (userId and userInitails required)"
        );
      }

      return user;
    } catch (err: any) {
      this.logger.error("error:", err);
      // Forward downstream error if available
      if (err?.response) {
        throw new HttpException(
          err.response,
          err.response.status ?? HttpStatus.UNAUTHORIZED
        );
      }
      // Handle timeout cleanly
      if (err?.code === "TIMEOUT") {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.SERVICE_UNAVAILABLE, [
            {
              field: "Authentication",
              code: "TIMEOUT",
              message: err.message || "Service timed out",
            },
          ]),
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      // Fallback for unknown errors
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
          {
            field: "Authentication",
            code: "UNAUTHORIZED",
            message: err.message || "Authentication failed",
          },
        ]),
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async callAuthService(accessToken: string, path?: string, method?: string, restApi?: boolean): Promise<AuthUser> {
    this.logger.log("path:", path);
    this.logger.log("method:", method);
    const timeout = this.timeoutAfter(this.timeoutMs);

    try {
      const authData ={
        ...(path && { route: path }),
        ...(method && { method: method }),
        restApi: restApi ?? true,
      }
      this.logger.log("authData:", authData);
      this.logger.log("Auth Guard: calling validateUser");
      const response = await Promise.race([
        this.authApi.auth.validateUser(
          {
            authData: authData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: AbortSignal.timeout(this.timeoutMs),
          }
        ),
        timeout,
      ]);

      this.logger.log(`Auth Guard: User validated successfully`);

      const payload = (response as any).data;

      this.logger.log("payload:", payload);

      return new AuthUser(
        payload.email,
        payload.userId,
        payload.userName,
        payload.userDisplayName,
        payload.userInitials,
      );
    } catch (err) {
      const error = err as any;
      this.logger.error(`Auth Guard: validateUser failed`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        fullError: err,
      });

      // Try to extract meaningful error message from different possible structures
      let errorMessage = "Authentication failed";

      // Handle Response object
      if (error.message) {
        errorMessage = error.message;
      } else if (error.statusText) {
        errorMessage = error.statusText;
      } else if (error.status) {
        errorMessage = `HTTP ${error.status}`;
      }

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.UNAUTHORIZED, [
          {
            field: "Authentication failed",
            code: error.status || ERROR_CONSTANTS.UNAUTHORIZED.code,
            message: errorMessage,
          },
        ]),
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  private timeoutAfter(ms: number) {
    return new Promise<never>((_, reject) => {
      const e: any = new Error("TIMEOUT");
      e.code = "TIMEOUT";
      setTimeout(() => reject(e), ms);
    });
  }
}
