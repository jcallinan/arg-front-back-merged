import { useState, useContext, createContext, useEffect } from "react";
import { setAccessToken, removeAccessToken } from "@/utils/cookieUtils";
import { getUserDetails, logoutUser } from "../api/authApiClient";
import type {
   AuthContextType,
   AuthProviderProps,
   User,
   AuthApiResponse,
} from "@/types/auth.types";
import { decryptData } from "@utils/cryptoUtils";
import { useTokenTiming } from "@/context/TokenTimingContext";

// Create the context with a more descriptive default value for debugging
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add debugging for context creation

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   // Get token timing functions
   const { clearTimings, forceTokenRefresh } = useTokenTiming();
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [lastLoginResponse, setLastLoginResponse] =
      useState<AuthApiResponse | null>(null);

   // Cleanup: this legacy key is no longer needed; ensure it's removed
   useEffect(() => {
      try {
         localStorage.removeItem("auth_last_login_response");
      } catch (error) {
         console.warn(
            "Failed to remove auth_last_login_response from localStorage:",
            error
         );
      }
   }, []);

   // Helper function to extract user data from API response
   const extractUserData = (responseData: AuthApiResponse): User => {
      // The responseData might be the decrypted data directly, or nested
      const userDetails =
         responseData.user || responseData.userDetails || responseData;

      const extractedUser = {
         id: userDetails?.UserId || userDetails?.userId || "unknown",
         email:
            userDetails?.email || userDetails?.Email || "unknown@example.com",
         name:
            userDetails?.userDisplayName ||
            userDetails?.displayName ||
            userDetails?.name ||
            "User",
         role: userDetails?.role || "User",
         displayName: userDetails?.userDisplayName || userDetails?.displayName,
         userId: userDetails?.UserId || userDetails?.userId,
      };

      return extractedUser;
   };

   // Method to handle successful login - calls getUserDetails API once after authentication
   // and, on first login (no token timestamp yet), triggers the token API once.
   const handleSuccessfulLogin = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // Call getUserDetails API using the proper API client
         const response = await getUserDetails();

         // Extract the data from the API response
         const data: AuthApiResponse = response.data;

         // Decrypt the data and extract user information
         let decryptedData = data;
         if (
            data.items &&
            typeof data.items === "object" &&
            "iv" in data.items &&
            "payload" in data.items
         ) {
            try {
               decryptedData = decryptData(data.items as any);
               // console.log(" Decrypted user data:", decryptedData);
            } catch (error) {
               console.error("❌ Failed to decrypt items:", error);
               decryptedData = data; // Fallback to original data
            }
         }

         // Save the complete response for future reference (in memory only)
         setLastLoginResponse(data);

         if (data) {
            // Extract access token from the API response
            const accessToken =
               data.token || data.access_token || data.jwt || data.accessToken;

            if (accessToken) {
               setAccessToken(accessToken);
            }

            // Extract and set user details from decrypted data
            const userData = extractUserData(decryptedData);
            setUser(userData);

            // Only call /token API if there's NO existing timestamp in localStorage
            // This ensures we only call it on FIRST login, not on every reload
            const existingTimestamp = localStorage.getItem(
               "auth_last_token_refresh_time"
            );
            if (!existingTimestamp) {
               try {
                  console.log("🔄 First login - calling /token API...");
                  await forceTokenRefresh();
               } catch (tokenError) {
                  console.error(
                     "❌ Failed to call /token API after login:",
                     tokenError
                  );
                  // Don't throw - login was successful, token refresh can retry later
               }
            } else {
               console.log(
                  "✓ Token timestamp exists - skipping /token call (scheduler will handle it)"
               );
            }
         } else {
            console.error("❌ No data returned from getUserDetails API");
            throw new Error("No data returned from getUserDetails API");
         }
      } catch (error) {
         const errorMessage =
            error instanceof Error ? error.message : "Authentication failed";
         console.error("❌ Failed to authenticate user:", error);
         setError(errorMessage);
         removeAccessToken();
         setUser(null);
         setLastLoginResponse(null);
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   // Always call getUserDetails API to check authentication status
   const checkAuthenticationStatus = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         try {
            const response = await getUserDetails();

            if (response && response.data && response.data.items) {
               let responseData: AuthApiResponse;

               // Check if items is encrypted string or already decrypted object
               if (typeof response.data.items === "string") {
                  // Try to decrypt the items string
                  try {
                     // Import decryption utilities
                     const { decryptData } = await import("@utils/cryptoUtils");
                     const decryptedData = decryptData(response.data.items);

                     if (decryptedData) {
                        responseData = decryptedData;
                     } else {
                        responseData = { items: response.data.items };
                     }
                  } catch (error) {
                     console.error("❌ Error during decryption:", error);
                     responseData = { items: response.data.items };
                  }
               } else {
                  responseData = response.data.items;
               }

               // Save the response for future reference
               setLastLoginResponse(responseData);

               // Extract access token from the API response
               const accessToken =
                  responseData.token ||
                  responseData.access_token ||
                  responseData.jwt ||
                  responseData.accessToken;

               if (accessToken) {
                  setAccessToken(accessToken);
               }

               // Extract and set user details
               const userData = extractUserData(responseData);

               setUser(userData);
            } else {
               setUser(null);
               setLastLoginResponse(null);
            }
         } catch (apiError) {
            const errorMessage =
               apiError instanceof Error
                  ? apiError.message
                  : "Authentication check failed";
            console.error("❌ getUserDetails API failed:", apiError);
            setError(errorMessage);
            // Clear any existing invalid tokens
            setUser(null);
            setLastLoginResponse(null);
         }
      } catch (error) {
         const errorMessage =
            error instanceof Error
               ? error.message
               : "Authentication check failed";
         console.error("Error checking authentication:", error);
         setError(errorMessage);
         setUser(null);
         setLastLoginResponse(null);
      } finally {
         setIsLoading(false);
      }
   };

   // Call checkAuthenticationStatus on component mount
   //  useEffect(() => {
   //    checkAuthenticationStatus();
   //  }, []);

   const login = async (email: string, _password: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // Simulate API call - replace with actual authentication logic
         await new Promise((resolve) => setTimeout(resolve, 1000));

         // Simulate successful login
         const userData: User = {
            id: "1",
            email,
            name: "Roger Philips",
            role: "User",
         };

         setUser(userData);
         setAccessToken("mock_token_" + Date.now());
      } catch (error) {
         const errorMessage =
            error instanceof Error ? error.message : "Login failed";
         console.error("Login failed:", error);
         setError(errorMessage);
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   const logout = async () => {
      try {
         await logoutUser();
      } catch (error) {
      } finally {
         // Clear token timing data on logout
         clearTimings();
         setError(null);
         setUser(null);
         removeAccessToken();
      }
   };

   // Additional utility methods
   const clearError = (): void => {
      setError(null);
   };

   const refreshUser = async (): Promise<void> => {
      await checkAuthenticationStatus();
   };

   const updateUser = (userData: Partial<User>): void => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
   };

   // Legacy method for OAuth callback (kept for compatibility)
   // Now simply delegates to handleSuccessfulLogin; token logic is handled there.
   const handleOAuthCallback = async (_authCode: string): Promise<void> => {
      await handleSuccessfulLogin();
   };

   const contextValue: AuthContextType = {
      // State
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      lastLoginResponse,

      // Actions
      login,
      logout,
      handleSuccessfulLogin,
      handleOAuthCallback,
      checkAuthenticationStatus,
      clearError,
      refreshUser,
      updateUser,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      console.error("❌ useAuth called outside of AuthProvider context");
      console.error("Current AuthContext value:", context);
      console.error("AuthContext object:", AuthContext);

      // Check if we're in development mode and provide a more helpful error
      if (process.env.NODE_ENV === "development") {
         console.error(
            "🔧 This might be caused by hot module reloading. Try refreshing the page."
         );
      }

      throw new Error(
         "useAuth must be used within an AuthProvider. Make sure the component is wrapped in <AuthProvider>."
      );
   }
   return context;
};
