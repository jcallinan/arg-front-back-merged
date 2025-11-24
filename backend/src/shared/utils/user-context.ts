import { AsyncLocalStorage } from "async_hooks";
import { AuthUser } from "@src/auth/domain/entities/auth-user.entity";

class UserContextManager {
  private storage = new AsyncLocalStorage<AuthUser>();

  run<T>(user: AuthUser, callback: () => T): T {
    return this.storage.run(user, callback);
  }

  get(): AuthUser | undefined {
    return this.storage.getStore();
  }

  getOrThrow(): AuthUser {
    const u = this.get();
    if (!u) throw new Error("UserContext: no user bound to current request");
    return u;
  }

  UserId(): string {
    return this.getOrThrow().userId;
  }

  userName(): string {
    return this.getOrThrow().userName;
  }

  userInitials(): string {
    return this.getOrThrow().userInitials;
  }
}

export const UserContext = new UserContextManager();

//helpers to get the current user, user id, and user initials
export const currentUser = () => UserContext.getOrThrow();
export const currentUserId = () => UserContext.UserId();
export const currentUserName = () => UserContext.userName();
export const currentUserInitials = () => UserContext.userInitials();