import { AuthUser } from "../entities/auth-user.entity";

export interface AuthRequest {
  user?: AuthUser;
  headers: Record<string, any>;
  cookies?: Record<string, any>;
  route?: { path: string };
  method: string;
  // you can extend with more if needed (params, body, etc.)
}
