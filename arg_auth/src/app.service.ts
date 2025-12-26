import {
  Injectable,
  UnauthorizedException,
  Logger,
  OnModuleInit
} from "@nestjs/common";
import { config } from "dotenv";
import { ConnectionService } from "@src/shared/infrastructure/connection.service"

// Load the single .env file
config({ path: "./.env" });

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private dbConnectionPromise: Promise<void> | null = null;

  constructor(private readonly connectionService: ConnectionService) { }

  healthCheck(): string {
    this.logger.log("Health check !");
    return "Health check !";
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

 private async initializeDatabase() {
    if (!this.dbConnectionPromise) {
      this.logger.log("Initializing PostgreSQL database connection...");
      this.dbConnectionPromise = this.connectionService.createDatabaseConnection()
        .then(() => {
          this.logger.log("PostgreSQL connection established successfully!");
        })
        .catch((err) => {
          this.logger.error("Failed to initialize PostgreSQL connection", err);
          this.dbConnectionPromise = null; // allow retry
        });
    }
  }

  async getSequelize() {
    try {
      if (this.dbConnectionPromise) {
        await this.dbConnectionPromise;
      }
      return this.connectionService.sequelize;
    } catch (error) {
      this.logger.error("Failed to get Sequelize instance:", error);
      throw new UnauthorizedException((error as Error).message);
    }
  }


  // Health check that includes database status
  async healthCheckWithDb(): Promise<{ status: string; database: string }> {
    try {
      if (this.dbConnectionPromise) {
        await this.dbConnectionPromise;
      }
      const sequelize = this.connectionService.sequelize!;
      await sequelize.authenticate();
      return { status: "OK", database: "Connected" };
    } catch (error) {
      this.logger.warn("Database health check failed:", error);
      return { status: "OK", database: "Disconnected" };
    }
  }
}
