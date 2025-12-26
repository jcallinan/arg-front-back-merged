export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: {
    user: number; // 24 hours in seconds (User navigation changes moderately)
    default: number;
  };
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
  connectTimeout: number;
}

export const cacheConfig: CacheConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'arg-backend:',
  ttl: {
    user: 24 * 60 * 60, // 24 hours
    default: 60 * 60, // 1 hour
  },
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  connectTimeout: 10000, // 10 seconds
};

export const CACHE_KEYS = {
  USER: {
    BY_EMAIL: (email: string) =>
      `user:email:${email}`,
    NAVIGATION_BY_USER_ID: (userId: number) =>
      `navigation:user:${userId}`,
    RIGHTS_BY_USER_ID: (userId: number) =>
      `rights:user:${userId}`,
    FORMATTED_RIGHTS_BY_USER_ID: (userId: number) =>
      `formatted-rights:user:${userId}`,
  },
} as const; 