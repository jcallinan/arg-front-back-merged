/**
 * Cookie utility functions for managing browser cookies
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Handle expires option
  if (options.expires) {
    let expires: Date;
    if (typeof options.expires === 'number') {
      // If number, treat as days from now
      expires = new Date();
      expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000);
    } else {
      expires = options.expires;
    }
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  // Add other options
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0), // Set to past date to delete
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

// Auth-specific cookie utilities
export const AUTH_COOKIE_NAME = 'access-token';

/**
 * Set the access token cookie with secure defaults
 */
export const setAccessToken = (token: string, expiresInDays: number = 7): void => {
  setCookie(AUTH_COOKIE_NAME, token, {
    expires: expiresInDays,
    path: '/',
    secure: window.location.protocol === 'https:', // Only secure in HTTPS
    sameSite: 'lax', // Good balance of security and functionality
  });
};

/**
 * Get the access token from cookies
 */
export const getAccessToken = (): string | null => {
  return getCookie(AUTH_COOKIE_NAME);
};

/**
 * Remove the access token cookie
 */
export const removeAccessToken = (): void => {
  removeCookie(AUTH_COOKIE_NAME, { path: '/' });
};

/**
 * Check if user is authenticated (has access token)
 */
export const isAuthenticated = (): boolean => {
  return hasCookie(AUTH_COOKIE_NAME);
};