// dotenv.config() won't fail if .env doesn't exist - it just won't load anything
require('dotenv').config({ path: './.env' });

// Schema configuration matching ENV_LIBRARY_CONFIG
const getSchemaForEnv = (env) => {
  switch (env) {
    case 'dev':
      return process.env.DB_DATA_LIB_DEV || 'public';
    case 'test':
      return process.env.DB_DATA_LIB_TEST || 'arg-test';
    case 'uat':
      return process.env.DB_DATA_LIB_UAT || 'arg-uat';
    case 'prod':
      return process.env.DB_DATA_LIB_PROD || 'arg-prod';
    default:
      return 'public';
  }
};

const createConfig = (env) => {
  const schema = getSchemaForEnv(env);
  return {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: 'postgres',
    schema: schema,
    seederStorage: 'sequelize',
    migrationsStorage: 'sequelize',
    dialectOptions: {
      options: `-c search_path=${schema}`,
    },
    define: {
      schema: schema,
    },
  };
};

module.exports = {
  dev: createConfig('dev'),
  test: createConfig('test'),
  uat: createConfig('uat'),
  prod: createConfig('prod'),
};

