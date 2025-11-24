import { Api } from './auth.api';

/**
 * Get user details from the backend - this API provides the access token
 */
export const getUserDetails = async () => {
  // Create API instance with proper configuration for credentials (same pattern as useApi)
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_AUTH_BASE,
    baseApiParams: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Configure to include credentials (cookies)
      credentials: 'include'
    },
  });
  
  
  try {
    const response = await api.auth.getUserDetails();
    return response;
  } catch (error) {
    console.error('❌ Error in getUserDetails API call:', error);
    
    // Check if this is a CORS/redirect issue (backend redirecting to login)
    if (error instanceof Error && error.message && error.message.includes('Failed to fetch')) {
      
      // Throw a specific error for unauthenticated users
      throw new Error('USER_NOT_AUTHENTICATED');
    }
    
    throw error;
  }
};

/**
 * Handle OAuth callback - exchange authorization code for bearer token
 */
export const handleCallback = async (code: string) => {
  console.log('🔄 Calling backend callback API with code:', code);
  
  // Create API instance (same pattern as useApi)
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_AUTH_BASE,
    baseApiParams: {
      headers: {
        'Content-Type': 'application/json'
      },
    },
  });
  
  try {
    const response = await api.auth.getUserDetails({});
    console.log('📥 Backend callback API response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error in callback API call:', error);
    throw error;
  }
};

/**
 * Validate user
 */
export const validateUser = async (metDataKey?: string) => {
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_AUTH_BASE,
    baseApiParams: {
      credentials: 'include'
    },
  });
  return api.auth.validateUser({ metDataKey });
};

/**
 * Get token
 */
export const getToken = async () => {
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_AUTH_BASE,
    baseApiParams: {
      credentials: 'include'
    },
  });
  return api.auth.getToken();
};

/**
 * Logout user from the backend
 */
export const logoutUser = async () => {
  // Create API instance with proper configuration for credentials (same pattern as useApi)
  const api = new Api({
    baseUrl: import.meta.env.VITE_API_AUTH_BASE,
    baseApiParams: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Configure to include credentials (cookies)
      credentials: 'include'
    },
  });
  
  try {
    const response = await api.auth.getLogout();
    return response;
  } catch (error) {
    console.error('❌ Error in logout API call:', error);
    throw error;
  }
};
