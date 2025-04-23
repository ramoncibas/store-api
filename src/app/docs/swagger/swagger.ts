import swaggerAutogen from 'swagger-autogen';
import { swaggerSchemas } from './config/schema';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Store API',
    description: 'APIs available in the store application'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server'
    },
  ],
  tags: [
    {
      name: 'Environment',
      description: 'development'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      }
    },
  },
  '@schemas': swaggerSchemas
};

const outputFile = './swagger.json';
const endpointsFiles = ['../../app/routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);