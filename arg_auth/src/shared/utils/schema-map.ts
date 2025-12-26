export const SCHEMA_MAP = {
  dev: process.env.DB_DATA_LIB_DEV || "public",
  test: process.env.DB_DATA_LIB_TEST || "arg-test",
  uat: process.env.DB_DATA_LIB_UAT || "arg-uat",
  prod: process.env.DB_DATA_LIB_PROD || "arg-prod",
};

export const resolveSchema = () => {
  const env = (process.env.NODE_ENV || "dev").toLowerCase();
  return SCHEMA_MAP[env] || "public";
};