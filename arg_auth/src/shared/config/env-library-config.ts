import { TABLE_REGISTRY, TableName } from "./constants/table-registry";

export const ENV_LIBRARY_CONFIG = {
  dev: {
    dataLib: process.env.DB_DATA_LIB_DEV || "public",
  },
  test: {
    dataLib: process.env.DB_DATA_LIB_TEST || "arg-test",
  },
  uat: {
    dataLib: process.env.DB_DATA_LIB_UAT || "arg-uat",
  },
  prod: {
    dataLib: process.env.DB_DATA_LIB_PROD || "arg-prod",
  },
} as const;

export type Environment = keyof typeof ENV_LIBRARY_CONFIG;
export type LibraryName = keyof (typeof ENV_LIBRARY_CONFIG)[Environment];

interface TableSchemaInfo {
  tableName: string;
  schemaName: string;
}

// Updated function to get table and schema information based on table name
export const getTableAndSchemaInfo = (
  tableName: TableName,
): TableSchemaInfo => {
  const env = process.env.NODE_ENV || "dev";
  const tableInfo = TABLE_REGISTRY[tableName];

  if (!tableInfo) {
    throw new Error(`No configuration found for table: ${tableName}`);
  }

  const schemaName = ENV_LIBRARY_CONFIG[env][tableInfo.defaultSchema];

  return {
    tableName: tableInfo.name,
    schemaName: schemaName,
  };
};

