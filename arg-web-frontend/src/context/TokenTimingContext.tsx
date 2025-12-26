import React, {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   useRef,
} from "react";
import { getToken } from "@/modules/auth/api/authApiClient";

interface TokenTimingState {
   meApiCallTime: number | null;
   lastTokenRefreshTime: number | null;
   isRefreshing: boolean;
   refreshScheduled: boolean;
}

interface TokenTimingContextType extends TokenTimingState {
   // Actions
   recordMeApiCall: () => void;
   scheduleTokenRefresh: () => void;
   cancelTokenRefresh: () => void;
   forceTokenRefresh: () => Promise<void>;
   clearTimings: () => void;
}

const TokenTimingContext = createContext<TokenTimingContextType | undefined>(
   undefined
);

interface TokenTimingProviderProps {
   children: React.ReactNode;
}

// Constants - TESTING VALUES
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 3 minutes (TEST: change back to 25 for production)
const THROTTLE_WINDOW = 30 * 1000; // 30 seconds
const PROACTIVE_THRESHOLD = 5 * 60 * 1000; // 1 minute (TEST: change back to 5 for production)

// constants for project
//const TOKEN_REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes
//const THROTTLE_WINDOW = 30 * 1000; // 30 seconds
//const PROACTIVE_THRESHOLD = 5 * 60 * 1000;
// LocalStorage keys
const STORAGE_KEYS = {
   ME_API_CALL_TIME: "auth_me_api_call_time",
   LAST_TOKEN_REFRESH_TIME: "auth_last_token_refresh_time",
} as const;

/**
 * Load timestamp from localStorage
 */
const loadFromStorage = (key: string): number | null => {
   try {
      const value = localStorage.getItem(key);
      return value ? parseInt(value, 10) : null;
   } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
      return null;
   }
};

/**
 * Save timestamp to localStorage
 */
const saveToStorage = (key: string, value: number | null): void => {
   try {
      if (value !== null) {
         localStorage.setItem(key, value.toString());
      } else {
         localStorage.removeItem(key);
      }
   } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
   }
};

export const TokenTimingProvider: React.FC<TokenTimingProviderProps> = ({
   children,
}) => {
   // Initialize state with persisted values from localStorage
   const [state, setState] = useState<TokenTimingState>(() => {
      const persistedLastTokenRefreshTime = loadFromStorage(
         STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME
      );

      //console.log("🔧 TokenTimingProvider initialized");
      if (persistedLastTokenRefreshTime) {
        //  console.log(
        //     "📊 Found existing token timestamp:",
        //     new Date(persistedLastTokenRefreshTime).toLocaleTimeString()
        //  );
      }

      return {
         meApiCallTime: persistedLastTokenRefreshTime,
         lastTokenRefreshTime: persistedLastTokenRefreshTime,
         isRefreshing: false,
         refreshScheduled: false,
      };
   });

   // Refs
   const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const throttleRef = useRef<boolean>(false);

   /**
    * Force token refresh with throttling
    * This is the ONLY function that calls /token API
    */
   const forceTokenRefresh = useCallback(async (): Promise<void> => {
      const callTime = Date.now();

      // Throttling check
      if (throttleRef.current) {
      
         return;
      }

      // Set throttle flag
      throttleRef.current = true;
    

      setState((prev) => ({
         ...prev,
         isRefreshing: true,
         refreshScheduled: false,
      }));

      try {
         await getToken();
         const successTime = Date.now(); // Capture time AFTER successful API call
        //  console.log(
        //     "✅ /token API successful at:",
        //     new Date(successTime).toLocaleTimeString()
        //  );

         // Store the SUCCESS timestamp - this is the source of truth
         saveToStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME, successTime);
         saveToStorage(STORAGE_KEYS.ME_API_CALL_TIME, successTime);

         setState((prev) => ({
            ...prev,
            lastTokenRefreshTime: successTime,
            meApiCallTime: successTime,
            isRefreshing: false,
         }));

        //  console.log(
        //     "📅 Next /token call will be at:",
        //     new Date(successTime + TOKEN_REFRESH_INTERVAL).toLocaleTimeString()
        //  );
      } catch (error) {
         console.error("❌ /token API failed:", error);
         setState((prev) => ({ ...prev, isRefreshing: false }));
         throw error;
      } finally {
         // Clear throttle flag after delay
         if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
         }
         throttleTimeoutRef.current = setTimeout(() => {
            throttleRef.current = false;
            throttleTimeoutRef.current = null;
         }, THROTTLE_WINDOW);
      }
   }, []);

   /**
    * Schedule the next token refresh based on localStorage timestamp
    * This function is called:
    * 1. On mount (initial setup)
    * 2. After successful token refresh (to schedule the next one)
    */
   const scheduleNextRefresh = useCallback(() => {
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
         clearTimeout(refreshTimeoutRef.current);
         refreshTimeoutRef.current = null;
      }

      // Read timestamp from localStorage (source of truth)
      const lastRefreshTime = loadFromStorage(
         STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME
      );

      if (!lastRefreshTime) {
        // console.log("⏭️ No token timestamp - waiting for first login");
         return;
      }

      // Calculate time remaining
      const currentTime = Date.now();
      const timeSinceLastRefresh = currentTime - lastRefreshTime;
      const timeUntilRefresh = TOKEN_REFRESH_INTERVAL - timeSinceLastRefresh;

      const minutesSince = Math.floor(timeSinceLastRefresh / 60000);
      const minutesRemaining = Math.ceil(timeUntilRefresh / 60000);

      // Case 1: Overdue (>3 minutes passed)
      if (timeUntilRefresh <= 0) {
        //  console.log(
        //     `🚨 Token overdue (${minutesSince} min elapsed) - calling /token immediately`
        //  );
         forceTokenRefresh(); // Effect will re-schedule automatically
         return;
      }

      // Case 2: Less than 1 minute remaining - trigger proactively
      if (timeUntilRefresh < PROACTIVE_THRESHOLD) {
         const secondsRemaining = Math.ceil(timeUntilRefresh / 1000);
        
         forceTokenRefresh(); // Effect will re-schedule automatically
         return;
      }

      // Case 3: Normal - schedule for exact remaining time
    
   

      setState((prev) => ({ ...prev, refreshScheduled: true }));

      refreshTimeoutRef.current = setTimeout(() => {
        
         forceTokenRefresh()
            .then(() => {
               // Don't call scheduleNextRefresh() here!
               // The effect will re-run automatically when state.lastTokenRefreshTime changes
              
            })
            .catch((error) => {
               console.error("❌ Failed to refresh token:", error);
            });
      }, timeUntilRefresh);
   }, [forceTokenRefresh]);

   // Cancel scheduled token refresh
   const cancelTokenRefresh = useCallback(() => {
      
      if (refreshTimeoutRef.current) {
         clearTimeout(refreshTimeoutRef.current);
         refreshTimeoutRef.current = null;
      }
      setState((prev) => ({ ...prev, refreshScheduled: false }));
   }, []);

   // Expose scheduleTokenRefresh for backward compatibility
   const scheduleTokenRefreshPublic = useCallback(() => {
    //  console.log("📅 scheduleTokenRefresh called");
      scheduleNextRefresh();
   }, [scheduleNextRefresh]);

   // Record /auth/me API call (legacy, for backward compatibility)
   const recordMeApiCall = useCallback(() => {
      const currentTime = Date.now();
      saveToStorage(STORAGE_KEYS.ME_API_CALL_TIME, currentTime);
      setState((prev) => ({
         ...prev,
         meApiCallTime: currentTime,
      }));
   }, []);

   // Clear all timings
   const clearTimings = useCallback(() => {
      cancelTokenRefresh();
      throttleRef.current = false;

      if (throttleTimeoutRef.current) {
         clearTimeout(throttleTimeoutRef.current);
         throttleTimeoutRef.current = null;
      }

      saveToStorage(STORAGE_KEYS.ME_API_CALL_TIME, null);
      saveToStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME, null);

      setState({
         meApiCallTime: null,
         lastTokenRefreshTime: null,
         isRefreshing: false,
         refreshScheduled: false,
      });
   }, [cancelTokenRefresh]);

   /**
    * Main effect - runs when scheduleNextRefresh changes (which is stable)
    * OR when a token refresh completes (state.lastTokenRefreshTime changes)
    * This ensures we re-schedule after each successful refresh
    */
   useEffect(() => {
   
      
      // Only schedule if we have a timestamp
      const hasTimestamp = loadFromStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME);
      if (hasTimestamp) {
         scheduleNextRefresh();
      }

      // Cleanup on unmount
      return () => {
         if (refreshTimeoutRef.current) {
            
            clearTimeout(refreshTimeoutRef.current);
            refreshTimeoutRef.current = null;
         }
      };
   }, [scheduleNextRefresh, state.lastTokenRefreshTime]); // Re-run when timestamp changes

   /**
    * Handle page visibility changes (user returns to tab)
    * Only checks if overdue, does NOT call API unless necessary
    */
   useEffect(() => {
      const handleVisibilityChange = () => {
         if (document.visibilityState === "visible") {
           

            const lastRefreshTime = loadFromStorage(
               STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME
            );
            if (!lastRefreshTime) return;

            const timeUntilRefresh =
               TOKEN_REFRESH_INTERVAL - (Date.now() - lastRefreshTime);
            const minutesSince = Math.floor(
               (Date.now() - lastRefreshTime) / 60000
            );

            if (timeUntilRefresh <= 0) {
              
               forceTokenRefresh(); // Effect will re-schedule automatically
            } else if (timeUntilRefresh < PROACTIVE_THRESHOLD) {
               const secondsRemaining = Math.ceil(timeUntilRefresh / 1000);
             
               forceTokenRefresh(); // Effect will re-schedule automatically
            } else {
              
            }
         }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
         document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
         );
      };
   }, [forceTokenRefresh, scheduleNextRefresh]);

   /**
    * Handle window focus (user returns to window)
    * Only checks if overdue, does NOT call API unless necessary
    */
   useEffect(() => {
      const handleFocus = () => {
        

         const lastRefreshTime = loadFromStorage(
            STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME
         );
         if (!lastRefreshTime) return;

         const timeUntilRefresh =
            TOKEN_REFRESH_INTERVAL - (Date.now() - lastRefreshTime);

          if (timeUntilRefresh <= 0) {
            
             forceTokenRefresh(); // Effect will re-schedule automatically
          } else if (timeUntilRefresh < PROACTIVE_THRESHOLD) {
             const secondsRemaining = Math.ceil(timeUntilRefresh / 1000);
            
             forceTokenRefresh(); // Effect will re-schedule automatically
          }
      };

      window.addEventListener("focus", handleFocus);
      return () => {
         window.removeEventListener("focus", handleFocus);
      };
   }, [forceTokenRefresh, scheduleNextRefresh]);

   const contextValue: TokenTimingContextType = {
      ...state,
      recordMeApiCall,
      scheduleTokenRefresh: scheduleTokenRefreshPublic,
      cancelTokenRefresh,
      forceTokenRefresh,
      clearTimings,
   };

   return (
      <TokenTimingContext.Provider value={contextValue}>
         {children}
      </TokenTimingContext.Provider>
   );
};

// Custom hook to use token timing context
export const useTokenTiming = (): TokenTimingContextType => {
   const context = useContext(TokenTimingContext);
   if (context === undefined) {
      throw new Error(
         "useTokenTiming must be used within a TokenTimingProvider"
      );
   }
   return context;
};

// Helper hook for components that need to know refresh status
export const useTokenRefreshStatus = () => {
   const { isRefreshing, refreshScheduled, lastTokenRefreshTime } =
      useTokenTiming();

   const timeUntilRefresh = lastTokenRefreshTime
      ? Math.max(0, lastTokenRefreshTime + TOKEN_REFRESH_INTERVAL - Date.now())
      : 0;

   const minutesUntilRefresh = Math.ceil(timeUntilRefresh / (60 * 1000));

   return {
      isRefreshing,
      refreshScheduled,
      timeUntilRefresh,
      minutesUntilRefresh,
      hasScheduledRefresh: refreshScheduled && timeUntilRefresh > 0,
   };
};
