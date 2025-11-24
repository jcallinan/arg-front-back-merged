import { getAs400Connection } from "@src/shared/infrastructure/connection";
import { QueryTypes } from "@sequelize/core";
import { Logger } from "@nestjs/common";
import { cleanupVariables } from "@src/shared/utils/db.utils";

const logger = new Logger("DynamicLibraryManager");

export interface LibraryConfig {
  dataLib: string;
  workDataLib: string;
  spLib: string;
  errmsg_out: string;
}

export class DynamicLibraryManager {
  private static instance: DynamicLibraryManager;
  private libraryConfig: LibraryConfig | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): DynamicLibraryManager {
    if (!DynamicLibraryManager.instance) {
      DynamicLibraryManager.instance = new DynamicLibraryManager();
    }
    return DynamicLibraryManager.instance;
  }

  /**
   * Call SETENVPRC stored procedure to get dynamic library configuration
   */
  public async setDynamicLibraries(
    environment: string
  ): Promise<LibraryConfig> {
    logger.log(`Setting dynamic libraries for environment: ${environment}`);

    const sequelize = getAs400Connection();
    const envUpper = environment.toUpperCase();

    // Define output variables
    const outputVars = {
      dataLib: "CHAR(10)",
      workDataLib: "CHAR(10)",
      spLib: "CHAR(10)",
      errmsg_out: "CHAR(50)",
    };

    // Generate unique variable names
    const uid = Math.random().toString(36).slice(2, 8);
    const resolvedVars = Object.entries(outputVars).reduce(
      (acc, [name, type]) => {
        const varName = `${name}_${uid}`;
        acc[name] = { fullName: `QGPL.${varName}`, type };
        return acc;
      },
      {} as Record<string, { fullName: string; type: string }>
    );

    try {
      // Cleanup any existing variables
      for (const { fullName } of Object.values(resolvedVars)) {
        await sequelize
          .query(`DROP VARIABLE ${fullName};`, { type: QueryTypes.RAW })
          .catch(() => {});
      }

      // Set schema to QGPL
      await sequelize.query(`SET SCHEMA QGPL`, { type: QueryTypes.RAW });

      // Create and initialize variables
      for (const { fullName, type } of Object.values(resolvedVars)) {
        await sequelize.query(
          `CREATE OR REPLACE VARIABLE ${fullName} ${type};`,
          {
            type: QueryTypes.RAW,
          }
        );
        await sequelize.query(`SET ${fullName} = ' ';`, {
          type: QueryTypes.RAW,
        });
      }

      // Find and call the stored procedure
      const spSchema = await this.findStoredProcedure(sequelize);
      const outputPlaceholders = Object.values(resolvedVars)
        .map((v) => v.fullName)
        .join(", ");

      const callSql = `CALL ${spSchema}.SETENVPRC('${envUpper}', ${outputPlaceholders});`;
      await sequelize.query(callSql, { type: QueryTypes.RAW });

      // Read output values
      const config: LibraryConfig = {
        dataLib: "",
        workDataLib: "",
        spLib: "",
        errmsg_out: "",
      };

      for (const [name, { fullName }] of Object.entries(resolvedVars)) {
        const result = await sequelize.query(`VALUES (${fullName});`, {
          type: QueryTypes.SELECT,
        });
        const value = result[0] ? (Object.values(result[0])[0] as string) : "";
        config[name as keyof LibraryConfig] = value?.trim() || "";
      }

      // Store the configuration
      this.libraryConfig = config;
      this.isInitialized = true;

      // Update environment variables with dynamic values
      this.updateEnvironmentVariables(config, envUpper);

      logger.log(`SETENVPRC completed successfully: ${JSON.stringify(config)}`);
      return config;
    } catch (error) {
      logger.error("SETENVPRC failed:", error);

      throw error;
    } finally { 
      await cleanupVariables(sequelize, resolvedVars);
    }
  } 

  /**
   * Get the current library configuration
   */
  public getLibraryConfig(): LibraryConfig | null {
    return this.libraryConfig;
  }

  /**
   * Check if libraries have been initialized
   */
  public isLibraryConfigInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get library name by type
   */
  public getLibraryName(
    libraryType: "dataLib" | "workDataLib" | "spLib"
  ): string {
    if (!this.libraryConfig) {
      throw new Error(
        "Library configuration not initialized. Call setDynamicLibraries() first."
      );
    }
    return this.libraryConfig[libraryType];
  }

  /**
   * Check if there were any errors
   */
  public hasErrors(): boolean {
    return this.libraryConfig?.errmsg_out?.trim() !== "";
  }

  /**
   * Get error message if any
   */
  public getErrorMessage(): string {
    return this.libraryConfig?.errmsg_out?.trim() || "";
  }

  /**
   * Update environment variables with dynamic library values
   */
  private updateEnvironmentVariables(
    config: LibraryConfig,
    environment: string
  ): void {
    const envLower = environment.toLowerCase();

    // Update environment variables based on the environment
    process.env[`DB_DATA_LIB_${envLower.toUpperCase()}`] = config.dataLib;
    process.env[`DB_WORK_DATA_LIB_${envLower.toUpperCase()}`] =
      config.workDataLib;
    process.env[`DB_SP_LIB_${envLower.toUpperCase()}`] = config.spLib;

    logger.log(`Updated environment variables for ${environment}:`);
    logger.log(`DB_DATA_LIB_${envLower.toUpperCase()}: ${config.dataLib}`);
    logger.log(
      `DB_WORK_DATA_LIB_${envLower.toUpperCase()}: ${config.workDataLib}`
    );
    logger.log(`DB_SP_LIB_${envLower.toUpperCase()}: ${config.spLib}`);
  }

  /**
   * Find the stored procedure schema
   */
  private async findStoredProcedure(sequelize: any): Promise<string> {
    try {
      const spQuery = `
        SELECT ROUTINE_SCHEMA, ROUTINE_NAME 
        FROM QSYS2.SYSROUTINES 
        WHERE ROUTINE_NAME = 'SETENVPRC' AND ROUTINE_TYPE = 'PROCEDURE'
      `;
      const spResult = await sequelize.query(spQuery, {
        type: QueryTypes.SELECT,
      });

      if (spResult.length > 0) {
        return spResult[0].ROUTINE_SCHEMA;
      } else {
        throw new Error("SETENVPRC stored procedure not found");
      }
    } catch (error) {
      logger.warn("Error finding stored procedure, using fallback");
      return "SETENVPRC";
    }
  }
}
