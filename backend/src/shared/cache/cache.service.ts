import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { AppLogger } from "../logger/logger.service";
import { cacheConfig , CACHE_KEYS } from "./cache.config";


@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new AppLogger(CacheService.name);
  private redis!: Redis;
  private isConnected = false;

  async onModuleInit() {
    await this.initializeRedis();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redis = new Redis({
        host: cacheConfig.host,
        port: cacheConfig.port,
        password: cacheConfig.password,
        db: cacheConfig.db,
        keyPrefix: cacheConfig.keyPrefix,
        connectTimeout: cacheConfig.connectTimeout,
        enableReadyCheck: cacheConfig.enableReadyCheck,
        maxRetriesPerRequest: cacheConfig.maxRetriesPerRequest,
        lazyConnect: true,
      });

      // Event listeners for connection monitoring
      this.redis.on("connect", () => {
        this.logger.log("🔗 Redis connection established");
        this.isConnected = true;
      });

      this.redis.on("ready", () => {
        this.logger.log("🚀 Redis is ready to accept commands");
      });

      this.redis.on("error", (error) => {
        this.logger.error(`❌ Redis connection error: ${error.message}`);
        this.isConnected = false;
      });

      this.redis.on("close", () => {
        this.logger.warn("🔌 Redis connection closed");
        this.isConnected = false;
      });

      this.redis.on("reconnecting", () => {
        this.logger.log("🔄 Redis reconnecting...");
      });

      // Connect to Redis
      await this.redis.connect();
      this.logger.log("✅ Redis cache service initialized successfully");
    } catch (error) {
      this.logger.error(
        `💥 Failed to initialize Redis: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      this.isConnected = false;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      this.logger.warn(
        `⚠️ Redis not connected, skipping cache get for key: ${key}`
      );
      return null;
    }

    try {
      const startTime = Date.now();
      const result = await this.redis.get(key);
      const duration = Date.now() - startTime;

      if (result) {
        this.logger.debug(`🎯 Cache HIT for key: ${key} (${duration}ms)`);
        return JSON.parse(result);
      } else {
        this.logger.debug(`❌ Cache MISS for key: ${key} (${duration}ms)`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `💥 Cache get error for key ${key}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected) {
      this.logger.warn(
        `⚠️ Redis not connected, skipping cache set for key: ${key}`
      );
      return false;
    }

    try {
      const startTime = Date.now();
      const serializedValue = JSON.stringify(value);
      const ttl = ttlSeconds || cacheConfig.ttl.default;

      await this.redis.setex(key, ttl, serializedValue);
      const duration = Date.now() - startTime;

      this.logger.debug(
        `💾 Cache SET for key: ${key} (TTL: ${ttl}s, ${duration}ms)`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `💥 Cache set error for key ${key}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isConnected) {
      this.logger.warn(
        `⚠️ Redis not connected, skipping cache delete for key: ${key}`
      );
      return false;
    }

    try {
      const result = await this.redis.del(key);
      this.logger.debug(`🗑️ Cache DELETE for key: ${key} (deleted: ${result})`);
      return result > 0;
    } catch (error) {
      this.logger.error(
        `💥 Cache delete error for key ${key}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return false;
    }
  }

  /**
   * Delete keys by pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.isConnected) {
      this.logger.warn(
        `⚠️ Redis not connected, skipping pattern delete: ${pattern}`
      );
      return 0;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      const result = await this.redis.del(...keys);
      this.logger.debug(
        `🗑️ Cache PATTERN DELETE: ${pattern} (deleted: ${result} keys)`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `💥 Cache pattern delete error for pattern ${pattern}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `💥 Cache exists error for key ${key}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return false;
    }
  }

  /**
   * Set multiple values at once (pipeline)
   */
  async setMultiple<T>(
    entries: Array<{ key: string; value: T; ttl?: number }>
  ): Promise<boolean> {
    if (!this.isConnected) {
      this.logger.warn(`⚠️ Redis not connected, skipping batch set operation`);
      return false;
    }

    try {
      const startTime = Date.now();
      const pipeline = this.redis.pipeline();

      entries.forEach(({ key, value, ttl }) => {
        const serializedValue = JSON.stringify(value);
        const expiry = ttl || cacheConfig.ttl.default;
        pipeline.setex(key, expiry, serializedValue);
      });

      await pipeline.exec();
      const duration = Date.now() - startTime;

      this.logger.log(
        `📦 Cache BATCH SET: ${entries.length} keys (${duration}ms)`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `💥 Cache batch set error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return false;
    }
  }

  /**
   * Set company in cache
   */
  async setCompany(company: any): Promise<void> {
    await this.set(
      CACHE_KEYS.COMPANY.BY_ID(company.companyNo),
      company,
      cacheConfig.ttl.company
    );
  }

  /**
   * Get Redis connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Gracefully disconnect from Redis
   */
  private async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.logger.log("👋 Redis connection closed gracefully");
    }
  }
}
