import schema from "config/schema/index";

const environments : any = {
  production: {
    database: process.env.DATABASE_URL,
    schema,
  },
  development: {
    database: process.env.DATABASE_DEV_URL,
    schema,
  },
  test: {
    database: process.env.DATABASE_TEST_URL,
    schema,
  },
};

const env = process.env.NODE_ENV || 'development';
const config = environments[env];

export default config;