import {
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import {
  connectAs400Db2IBMi,
  getAs400SequelizeInstance,
} from "@src/shared/infrastructure/connection";
import { OnModuleInit } from "@nestjs/common";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private dbConnectionPromise: Promise<void> | null = null;

  healthCheck(): string {
    return "Health check !";
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

  constructor() { }

  private async initializeDatabase() {
    if (!this.dbConnectionPromise) {
      this.logger.log("Initializing database connection in background...");
      this.dbConnectionPromise = connectAs400Db2IBMi();

      // Handle connection result without blocking
      this.dbConnectionPromise
        .then(() => {
          this.logger.log("Database connection established successfully in background");
        })
        .catch((error) => {
          this.logger.error("Background database connection failed:", error);
          // Reset promise to allow retry
          this.dbConnectionPromise = null;
        });
    }
  }

  async getSequelize() {
    try {
      // Ensure database is connected before returning sequelize instance
      if (this.dbConnectionPromise) {
        await this.dbConnectionPromise;
      }
      return getAs400SequelizeInstance();
    } catch (error) {
      this.logger.error("Failed to get database connection:", error);
      throw new UnauthorizedException((error as Error).message);
    }
  }

  // Health check that includes database status
  async healthCheckWithDb(): Promise<{ status: string; database: string }> {
    try {
      if (this.dbConnectionPromise) {
        await this.dbConnectionPromise;
      }
      const sequelize = getAs400SequelizeInstance();
      await sequelize.authenticate();
      return { status: "OK", database: "Connected" };
    } catch (error) {
      this.logger.warn("Database health check failed:", error);
      return { status: "OK", database: "Disconnected" };
    }
  }
}
