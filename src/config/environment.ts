import schema from "../database/schema";

const environments : any = {
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
const config = environments[env];

export default config;