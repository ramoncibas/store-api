import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Store API',
    description: 'APIs available in the store application'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: ''
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app/routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);