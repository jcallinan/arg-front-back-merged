import { DYNAMIC_TABLE_REGISTRY, DynamicTableName, Metadata } from "./constants/dynamic-table-registry";
import { TABLE_REGISTRY, TableName } from "./constants/table-registry";

export const ENV_LIBRARY_CONFIG = {
  dev: {
    dataLib: process.env.DB_DATA_LIB_DEV || "DATADEV",
    workDataLib: process.env.DB_WORK_DATA_LIB_DEV || "QS36FDEV",
    spLib: process.env.DB_SP_LIB_DEV || "GSSLIBDEV",
  },
  test: {
    dataLib: process.env.DB_DATA_LIB_TEST,
    workDataLib: process.env.DB_WORK_DATA_LIB_TEST,
    spLib: process.env.DB_SP_LIB_TEST || "GSSLIBTEST",
  },
  uat: {
    dataLib: process.env.DB_DATA_LIB_UAT,
    workDataLib: process.env.DB_WORK_DATA_LIB_UAT,
    spLib: process.env.DB_SP_LIB_UAT || "GSSLIBUAT"
  },
  prod: {
    dataLib: process.env.DB_DATA_LIB_PROD,
    workDataLib: process.env.DB_WORK_DATA_LIB_PROD,
    spLib: process.env.DB_SP_LIB_PROD,
  },
} as const;

export type Environment = keyof typeof ENV_LIBRARY_CONFIG;
export type LibraryName = keyof (typeof ENV_LIBRARY_CONFIG)[Environment];

interface TableSchemaInfo {
  tableName: string;
  schemaName: string;
}

export const getTableAndSchemaInfo = (
  tableName: TableName,
): TableSchemaInfo => {
  const tableInfo = TABLE_REGISTRY[tableName];

  if (!tableInfo) {
    throw new Error(`No configuration found for table: ${tableName}`);
  }

  const env = (process.env.NODE_ENV as Environment) || "dev";
  const schemaName = ENV_LIBRARY_CONFIG[env][tableInfo.defaultSchema as LibraryName] || "";

  return {
    tableName: tableInfo.name,
    schemaName: schemaName,
  };
};

export interface DynamicTableSchemaInfo {
  tableName: string;
  schemaName: string;
  sourceSchemaName?: string; // Schema for source table (if different)
  metadata: Metadata;
}

export const getDynamicTableAndSchemaInfo = (
  tableName: DynamicTableName,
): DynamicTableSchemaInfo => {
  const tableInfo = DYNAMIC_TABLE_REGISTRY[tableName];

  if (!tableInfo) {
    throw new Error(`No configuration found for table: ${tableName}`);
  }

  const env = (process.env.NODE_ENV as Environment) || "dev";
  const schemaName = ENV_LIBRARY_CONFIG[env][tableInfo.defaultSchema as LibraryName] || "";
  
  // If sourceTableSchema is specified, use it for source table, otherwise use defaultSchema
  const sourceSchemaName = tableInfo?.metadata?.sourceTableSchema 
    ? ENV_LIBRARY_CONFIG[env][tableInfo?.metadata?.sourceTableSchema as LibraryName] || ""
    : schemaName;

  return {
    tableName: tableInfo.name || "",
    schemaName: schemaName,
    sourceSchemaName: sourceSchemaName,
    metadata: tableInfo.metadata,
  };
};

