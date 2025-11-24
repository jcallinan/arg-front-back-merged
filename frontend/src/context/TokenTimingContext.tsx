import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getToken } from '@/modules/auth/api/authApiClient';

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

const TokenTimingContext = createContext<TokenTimingContextType | undefined>(undefined);

interface TokenTimingProviderProps {
  children: React.ReactNode;
}
// Token refresh interval: 28 minutes in milliseconds
const TOKEN_REFRESH_INTERVAL = 28 * 60 * 1000; // 28 minutes
// Throttle window: prevent multiple refresh attempts within 30 seconds
const THROTTLE_WINDOW = 30 * 1000; // 30 seconds

// LocalStorage keys for persistence
const STORAGE_KEYS = {
  ME_API_CALL_TIME: 'auth_me_api_call_time',
  LAST_TOKEN_REFRESH_TIME: 'auth_last_token_refresh_time',
} as const;

// Helper functions for localStorage persistence
const loadFromStorage = (key: string): number | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : null;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return null;
  }
};

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

export const TokenTimingProvider: React.FC<TokenTimingProviderProps> = ({ children }) => {
  // Initialize state with persisted values from localStorage
  const [state, setState] = useState<TokenTimingState>(() => {
    const persistedMeApiCallTime = loadFromStorage(STORAGE_KEYS.ME_API_CALL_TIME);
    const persistedLastTokenRefreshTime = loadFromStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME);
    return {
      meApiCallTime: persistedMeApiCallTime,
      lastTokenRefreshTime: persistedLastTokenRefreshTime,
      isRefreshing: false,
      refreshScheduled: false,
    };
  });

  // Use refs to store timeout IDs and prevent memory leaks
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const throttleRef = useRef<boolean>(false);

  // Record when the me API was called
  const recordMeApiCall = useCallback(() => {
    const currentTime = Date.now();
    
    // Persist to localStorage
    saveToStorage(STORAGE_KEYS.ME_API_CALL_TIME, currentTime);
    
    setState(prev => ({
      ...prev,
      meApiCallTime: currentTime,
    }));

    // Automatically schedule token refresh
    scheduleTokenRefresh();
  }, []);

   // Schedule token refresh after the specified interval
   const scheduleTokenRefresh = useCallback(() => {
     // Clear any existing timeout
     if (refreshTimeoutRef.current) {
       clearTimeout(refreshTimeoutRef.current);
       refreshTimeoutRef.current = null;
     }

     const intervalMinutes = TOKEN_REFRESH_INTERVAL / (60 * 1000);
     
     setState(prev => ({ ...prev, refreshScheduled: true }));

     refreshTimeoutRef.current = setTimeout(() => {
       forceTokenRefresh();
     }, TOKEN_REFRESH_INTERVAL);
   }, []);

  // Cancel scheduled token refresh
  const cancelTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    setState(prev => ({ ...prev, refreshScheduled: false }));
  }, []);

  // Force token refresh with throttling
  const forceTokenRefresh = useCallback(async (): Promise<void> => {
    const currentTime = Date.now();

    // Check throttling - prevent multiple calls within throttle window
    if (throttleRef.current) {
      return;
    }

    // Check if we recently refreshed (within throttle window)
    if (state.lastTokenRefreshTime && (currentTime - state.lastTokenRefreshTime) < THROTTLE_WINDOW) {
      return;
    }

    // Set throttle flag
    throttleRef.current = true;

    setState(prev => ({ 
      ...prev, 
      isRefreshing: true,
      refreshScheduled: false 
    }));

    try {
      const response = await getToken();
      
      
      // Persist to localStorage
      saveToStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME, currentTime);
      
      setState(prev => ({
        ...prev,
        lastTokenRefreshTime: currentTime,
        isRefreshing: false,
      }));

      // Schedule next refresh
      scheduleTokenRefresh();

    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      setState(prev => ({ ...prev, isRefreshing: false }));
      
      // Retry after 5 minutes on failure
      refreshTimeoutRef.current = setTimeout(() => {
        forceTokenRefresh();
      }, 5 * 60 * 1000); // 5 minutes retry
      
    } finally {
      // Clear throttle flag after a delay
      setTimeout(() => {
        throttleRef.current = false;
      }, THROTTLE_WINDOW);
    }
  }, [state.lastTokenRefreshTime, scheduleTokenRefresh]);

  // Clear all timings and cancel scheduled refreshes
  const clearTimings = useCallback(() => {
    cancelTokenRefresh();
    throttleRef.current = false;
    
    // Clear from localStorage
    saveToStorage(STORAGE_KEYS.ME_API_CALL_TIME, null);
    saveToStorage(STORAGE_KEYS.LAST_TOKEN_REFRESH_TIME, null);
    
    setState({
      meApiCallTime: null,
      lastTokenRefreshTime: null,
      isRefreshing: false,
      refreshScheduled: false,
    });
    
  }, [cancelTokenRefresh]);

  // Auto-schedule token refresh on mount if we have persisted meApiCallTime
  useEffect(() => {
    if (state.meApiCallTime && !state.refreshScheduled) {
      const timeSinceLastCall = Date.now() - state.meApiCallTime;
      const timeUntilRefresh = TOKEN_REFRESH_INTERVAL - timeSinceLastCall;
      
      if (timeUntilRefresh > 0) {
        // Still within the 28-minute window, schedule the remaining time
       
        scheduleTokenRefresh();
      } else {
        // Time has already passed, refresh immediately
        forceTokenRefresh();
      }
    }
  }, [state.meApiCallTime, state.refreshScheduled, scheduleTokenRefresh, forceTokenRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Debug logging for state changes


  const contextValue: TokenTimingContextType = {
    ...state,
    recordMeApiCall,
    scheduleTokenRefresh,
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
    throw new Error('useTokenTiming must be used within a TokenTimingProvider');
  }
  return context;
};

// Helper hook for components that need to know refresh status
export const useTokenRefreshStatus = () => {
  const { isRefreshing, refreshScheduled, meApiCallTime } = useTokenTiming();
  
  const timeUntilRefresh = meApiCallTime 
    ? Math.max(0, (meApiCallTime + TOKEN_REFRESH_INTERVAL) - Date.now())
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
