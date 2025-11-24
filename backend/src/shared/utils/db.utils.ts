import { QueryTypes, Sequelize } from "@sequelize/core";
import { DynamicTableSchemaInfo } from "@src/shared/config/env-library-config"
/**
 * Build the dynamic table name from prefix and suffix
 */
export const buildTableName = (
  metadata: { suffix?: string, prefix?: string },
  tableInfo: any
): string => {
  const prefix = metadata.prefix ?? tableInfo.metadata.prefix;
  const suffix = metadata.suffix ?? tableInfo.metadata.suffix;
  return `${prefix}${suffix}`;
}

/** 
 * Validate that the reference model exists
 */
export const validateReferenceModel = (tableInfo: any): boolean => {
  if (!tableInfo.metadata.referenceModel) {
    console.warn(`No reference model found`);
    return false;
  }
  return true;
}

/**
 * Check if the model is already initialized
 */
export const isModelAlreadyInitialized = (sequelize: Sequelize, modelKey: string): boolean => {
  return !!sequelize.models[modelKey];
}

/**
 * Initialize the dynamic model with Sequelize
 */
export const initializeModelWithSequelize = (
  tableInfo: DynamicTableSchemaInfo,
  sequelize: Sequelize,
  tableName: string,
): any => {
  
  // Create a new model class that extends the reference model
  const DynamicModel = class extends (tableInfo.metadata.referenceModel as any) {};
  
  // Initialize the new model class
  DynamicModel.init(tableInfo.metadata.schema, {
    sequelize,
    tableName,
    modelName: tableName,
    schema: tableInfo.schemaName,
    timestamps: false,
  });
  
  return DynamicModel;
}

/**
 * Register the model in Sequelize
 */
export const registerModel = (
  sequelize: Sequelize,
  modelKey: string,
  model: any
): void => {
  sequelize.models[modelKey] = model as any;
}


export async function cleanupVariables(
  sequelize: any,
  resolvedVars: Record<string, { fullName: string; type: string }>
): Promise<void> {
  for (const { fullName } of Object.values(resolvedVars)) {
    await sequelize
      .query(`DROP VARIABLE ${fullName};`, { type: QueryTypes.RAW })
      .catch(() => {});
  }
  console.log(`Cleaned up variables: ${JSON.stringify(resolvedVars)}`);
} 