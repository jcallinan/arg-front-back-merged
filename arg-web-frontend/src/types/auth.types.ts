// Authentication and Authorization Types

export interface User {
   id: string;
   email: string;
   name: string;
   role: string;
   displayName?: string;
   userId?: string;
}

export interface AuthApiResponse {
  token?: string;
  access_token?: string;
  jwt?: string;
  accessToken?: string;
  // Navigation data from authorization API (can be encrypted or decrypted)
  navigation?: any[] | { iv: string; payload: string };
  // Items field can be encrypted string or decrypted object
  items?: string | {
    email?: string;
    userDisplayName?: string;
    userInitials?: string;
    UserId?: string;
    navigation?: any[];
    // After decryption, items may contain navigation and other user data
    [key: string]: any;
  };
  user?: {
    UserId?: string;
    userId?: string;
    Email?: string;
    email?: string;
    userDisplayName?: string;
    displayName?: string;
    name?: string;
    role?: string;
  };
  userDetails?: {
    UserId?: string;
    userId?: string;
    Email?: string;
    email?: string;
    userDisplayName?: string;
    displayName?: string;
    name?: string;
    role?: string;
  };
  // For cases where user data is at the root level
  UserId?: string;
  userId?: string;
  Email?: string;
  email?: string;
  userDisplayName?: string;
  displayName?: string;
  name?: string;
  role?: string;
}

export interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;
   lastLoginResponse: AuthApiResponse | null;
}

export interface AuthContextType extends AuthState {
   // Actions
   login: (email: string, password: string) => Promise<void>;
   logout: () => void;
   handleSuccessfulLogin: () => Promise<void>;
   handleOAuthCallback: (authCode: string) => Promise<void>;
   checkAuthenticationStatus: () => Promise<void>;
   clearError: () => void;

   // Additional utility methods
   refreshUser: () => Promise<void>;
   updateUser: (userData: Partial<User>) => void;
}

export interface AuthProviderProps {
   children: React.ReactNode;
}

export interface LoginCredentials {
   email: string;
   password: string;
}

export interface AuthError {
   message: string;
   code?: string;
   status?: number;
}
