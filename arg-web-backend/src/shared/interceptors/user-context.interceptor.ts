import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { UserContext } from "@src/shared/utils/user-context";
  import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";
  import { AuthRequest } from "@src/auth/domain/interface/auth-request.interface";
  
  @Injectable()
  export class UserContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest<AuthRequest & { user?: AuthUser }>();
      const user = req.user;
  
      if (!user) {
        // public route or unauthenticated; continue without binding
        return next.handle();
      }
  
      // bind the user for the remainder of this request pipeline
      return UserContext.run(user, () => next.handle());
    }
  }