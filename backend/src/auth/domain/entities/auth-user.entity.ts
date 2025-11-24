export class AuthUser {
    constructor(
      public readonly email: string,
      public readonly userId: string,
      public readonly userName: string,
      public readonly userDisplayName: string,
      public readonly userInitials: string,
    ) {}
  
    isValid(): boolean {
      return (
        !!this.email &&
        !!this.userId &&
        !!this.userName &&
        !!this.userDisplayName &&
        !!this.userInitials
      );
    }
  }
  