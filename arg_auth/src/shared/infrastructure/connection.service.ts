import { Injectable, Logger } from "@nestjs/common";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { AUTH_MODEL_CONFIGS } from "@src/main/auth/data/models/index";
import {
  ENV_LIBRARY_CONFIG,
  Environment,
  getTableAndSchemaInfo,
} from "@src/shared/config/env-library-config";

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);
  public sequelize: Sequelize | null = null;

  constructor() { }

  private connectionConfig(): SequelizeOptions {
    const host = process.env.DB_HOST || "localhost";
    const port = parseInt(process.env.DB_PORT || "5432", 10);
    const database = process.env.DB_NAME || "arg-auth";
    const username = process.env.DB_USERNAME || "postgres";
    const password = process.env.DB_PASSWORD || "93264Abhi@";

    this.logger.log(
      `Connecting to PostgreSQL -> host=${host} port=${port} db=${database} user=${username}`
    );

    return {
      host,
      port,
      database,
      username,
      password,
      dialect: "postgres",
    };
  }


  private customSequelizeLogger(sql: string, timing?: number) {
    const timestamp = new Date().toISOString();
    this.logger.debug(`[${timestamp}] [Sequelize Query] ${sql}`);
    if (timing) {
      this.logger.debug(`[${timestamp}] [Sequelize Timing] ${timing}ms`);
    }
  }

  private initializeModels(sequelize: Sequelize): void {

    try {
      const allModelConfigs: Record<string, any>[] = [
        AUTH_MODEL_CONFIGS,
        // Add other module configs here
      ];

      const models: any[] = [];

      allModelConfigs.forEach((configs) => {
        Object.values(configs).forEach(({ model, tableName }) => {
          const tableInfo = getTableAndSchemaInfo(tableName);

          model.tableName = tableInfo.tableName;
          model.schema = tableInfo.schemaName;

          models.push(model);
        });
      });

      sequelize.addModels(models);

    } catch (error) {
      this.logger.error("❌ Failed to initialize Models to PostgreSQL", error);
      throw new Error("Failed to initialize Models to PostgreSQL");
    }

  }

  public async createDatabaseConnection() {
    if (this.sequelize) return this.sequelize;

    const isDevelopment = process.env.NODE_ENV === "dev";
    const isProduction = process.env.NODE_ENV === "production";
    const defaultSchema = ENV_LIBRARY_CONFIG[process.env.NODE_ENV as Environment]?.dataLib || "public";

    try {
      this.logger.log("Establishing PostgreSQL connection...");
      this.logger.log(`Using PostgreSQL schema: ${defaultSchema}`);

      this.sequelize = new Sequelize({
        ...this.connectionConfig(),
        logging: isProduction ? false : this.customSequelizeLogger.bind(this),
        dialect: 'postgres',
        benchmark: true,
        logQueryParameters: isDevelopment,
        schema: defaultSchema,
        define: {
          schema: defaultSchema,
        },
        dialectOptions: {
          options: `-c search_path=${defaultSchema}`,
        },
        pool: {
          max: isDevelopment ? 10 : 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
          evict: 10000,
        },
        retry: {
          max: isDevelopment ? 2 : 5,
        },
      });

      // Initialize models
      this.logger.log("Initialized models with Sequelize instance");
      this.initializeModels(this.sequelize);

      await this.sequelize.authenticate();
      this.logger.log("✅ Successfully connected to PostgreSQL database");

      // Optional: sync tables
      // if(isDevelopment) {
      await this.sequelize.sync({ alter: false });
      // }

      return this.sequelize;
    } catch (error) {
      this.logger.error("❌ Failed to connect to PostgreSQL", error);
      throw new Error("Failed to connect to PostgreSQL");
    }
  }


}
