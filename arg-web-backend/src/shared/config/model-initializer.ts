import { Sequelize } from "@sequelize/core";
import { getDynamicTableAndSchemaInfo, getTableAndSchemaInfo } from "./env-library-config";
import { TABLE_REGISTRY } from "./constants/table-registry";
import { DYNAMIC_TABLE_REGISTRY } from "./constants/dynamic-table-registry";
import { getAs400SequelizeInstance } from "../infrastructure/connection";
import {buildTableName,validateReferenceModel,isModelAlreadyInitialized,initializeModelWithSequelize,registerModel} from "@src/shared/utils/db.utils"
export function initializeModel<
  T extends { init: (schema: any, options: any) => void },
>(
  sequelize: Sequelize,
  model: T,
  modelName: keyof typeof TABLE_REGISTRY,
  schema: any,
): void {
  const tableInfo = getTableAndSchemaInfo(modelName);
  const modelKey = modelName as string;

  if (!sequelize.models[modelKey]) {
    model.init(schema, {
      sequelize,
      tableName: tableInfo.tableName,
      schema: tableInfo.schemaName,
      timestamps: false,
    });
  }
  sequelize.models[modelKey] = model;
}

export function initializeDynamicModel<
  T extends { init: (schema: any, options: any) => void },
>(
  modelName: keyof typeof DYNAMIC_TABLE_REGISTRY,
  metadata: { suffix?: string, prefix?: string },
): T | null {
  try {
    // Get sequelize instance directly
    const sequelize = getAs400SequelizeInstance();
    const tableInfo = getDynamicTableAndSchemaInfo(modelName);
    const tableName = buildTableName(metadata, tableInfo);
    const modelKey = tableName;
    if (!validateReferenceModel(tableInfo)) {
      return null;
    }
    // Check if model already exists
    if (isModelAlreadyInitialized(sequelize, modelKey)) {
      return sequelize.models[modelKey] as T;
    }

    const dynamicModel = initializeModelWithSequelize(tableInfo, sequelize, tableName);
    registerModel(sequelize, modelKey, dynamicModel);
    return sequelize.models[modelKey] as T;
  } catch (error) {
    console.error(`Error getting Sequelize instance for model ${modelName}:`, error);
    return null;
  }
}
