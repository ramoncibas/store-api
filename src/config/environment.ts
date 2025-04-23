import schema from "database/schema";

interface EnvironmentConfig {
  schema: string;
  envFilePath: {
    path: string;
  };
}

interface Environments {
  [key: string]: EnvironmentConfig;
}

const environments: Environments = {
  production: {
    schema,
    envFilePath: {
      path: '.env'
    },
  },
  development: {
    schema,
    envFilePath: {
      path: '.env.dev'
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const config: EnvironmentConfig = environments[env];

export default config;