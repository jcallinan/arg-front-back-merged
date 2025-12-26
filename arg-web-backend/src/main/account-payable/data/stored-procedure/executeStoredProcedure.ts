import { getAs400Connection } from "@src/shared/infrastructure/connection";
import { QueryTypes } from "@sequelize/core";
import { Logger } from "@nestjs/common";
import {
  ENV_LIBRARY_CONFIG,
  Environment,
} from "@src/shared/config/env-library-config";
import { cleanupVariables } from "@src/shared/utils/db.utils";

const logger = new Logger("executeStoredProcedure");

interface ExecuteStoredProcedureInput {
  procedureName: string;
  inputParams: (string | number)[];
  outputVars?: Record<string, string>;
}

export const executeStoredProcedure = async ({
  procedureName,
  inputParams,
  outputVars = {},
}: ExecuteStoredProcedureInput): Promise<Record<string, string | null>> => {
  logger.log(`Executing stored procedure: ${procedureName}`);
  logger.log(`Input parameters: ${JSON.stringify(inputParams)}`);
  logger.log(`Output variables: ${JSON.stringify(outputVars)}`);

  const env = process.env.NODE_ENV as Environment;
  const spSchema = ENV_LIBRARY_CONFIG[env].spLib;
  const sequelize = getAs400Connection();

  if (!spSchema) {
    throw new Error(
      "ENV_LIBRARY_CONFIG[env].spLib is not configured. Set DB_SP_LIB for the current NODE_ENV."
    );
  }
  const envUpper = env.toUpperCase();

  const uid = Math.random().toString(36).slice(2, 8);

  // Generate unique variable names
  const resolvedVars = Object.entries(outputVars).reduce(
    (acc, [name, type]) => {
      const varName = `${name}_${uid}`;
      acc[name] = { fullName: `${spSchema}.${varName}`, type };
      return acc;
    },
    {} as Record<string, { fullName: string; type: string }>
  );

  try {
    // Drop any existing variables (safe cleanup)
    for (const { fullName } of Object.values(resolvedVars)) {
      await sequelize
        .query(`DROP VARIABLE ${fullName};`, { type: QueryTypes.RAW })
        .catch(() => {});
    }

    // Set schema
    await sequelize.query(`SET SCHEMA ${spSchema}`, { type: QueryTypes.RAW });

    // Create output variables

    for (const { fullName, type } of Object.values(resolvedVars)) {
      await sequelize.query(`CREATE OR REPLACE VARIABLE ${fullName} ${type};`, {
        type: QueryTypes.RAW,
      });
      await sequelize.query(`SET ${fullName} = '';`, { type: QueryTypes.RAW });
    }

    // Prepend env to input params
    const finalParams = [envUpper, ...inputParams];

    // Prepare param placeholders like :1, :2, ...
    const paramPlaceholders = finalParams
      .map((_, i) => `:param${i + 1}`)
      .join(", ");

    const outputPlaceholders = Object.values(resolvedVars)
      .map((v) => v.fullName)
      .join(", ");

    // Build the CALL SQL
    const callSql = `CALL ${spSchema}.${procedureName}(${[paramPlaceholders, outputPlaceholders].filter(Boolean).join(", ")});`;

    // Create named replacements for the query
    const replacements = finalParams.reduce(
      (acc, val, idx) => {
        acc[`param${idx + 1}`] = val;
        return acc;
      },
      {} as Record<string, string | number>
    );

    logger.log(`replacements: ${JSON.stringify(replacements)}`);
    logger.log(
      `Calling SP: ${procedureName} with params: ${JSON.stringify(finalParams)}`
    );

    logger.log(`callSql: ${callSql}`);

    const inlineSql = `CALL ${spSchema}.${procedureName}(${[
      finalParams
        .map((v) => (v === null || v === undefined ? "NULL" : `'${v}'`))
        .join(", "),
      Object.values(resolvedVars)
        .map((v) => v.fullName)
        .join(", "),
    ]
      .filter(Boolean)
      .join(", ")});`;

    logger.log(`Final inline SP call (debug only): ${inlineSql}`);

    await sequelize.query(callSql, {
      replacements,
      type: QueryTypes.RAW,
    });

    // Read output values
    const output: Record<string, string | null> = {};
    for (const [name, { fullName }] of Object.entries(resolvedVars)) {
      const result = await sequelize.query(`VALUES (${fullName});`, {
        type: QueryTypes.SELECT,
      });
      output[name] = result[0] ? (Object.values(result[0])[0] as string) : null;
    }

    // Cleanup output vars
    for (const { fullName } of Object.values(resolvedVars)) {
      await sequelize
        .query(`DROP VARIABLE ${fullName};`, { type: QueryTypes.RAW })
        .catch(() => {});
    }
    logger.log(
      `Stored procedure execution completed: ${JSON.stringify(output)}`
    );
    return output;
  } catch (error) {
    logger.error("Stored procedure execution failed:", error);

    throw error;
  } finally {
    await cleanupVariables(sequelize, resolvedVars);
  }
};
 
