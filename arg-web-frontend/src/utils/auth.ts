
import { getAccessToken, removeAccessToken } from './cookieUtils';

export const getBearerToken = (): string | null => {
  return getAccessToken();
};

/**
 * Clear bearer token
 */
export const clearBearerToken = (): void => {
  removeAccessToken();
};
 
/**
 * Check if bearer token exists
 */
export const hasBearerToken = (): boolean => {
   return getBearerToken() !== null;
};
 
 