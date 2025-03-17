import dotenv from 'dotenv';
import config from 'config/environment';
dotenv.config(config.envFilePath);

import express, { Application } from 'express';
import appRoutes from 'routes';
import setupMiddlewares from './middlewares';
import { createAndSeedDatabase } from 'lib/seeds';

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './app/docs/swagger/swagger.json';
import { cleanupTempFiles, setupProcessListeners } from 'utils';
import { reset, red, blue, cyan, green } from 'app/common/colors';

const { PORT = 5000 } = process.env;

const app: Application = express();

// Set up middlewares for security, logging, request handling, and rate-limiting
setupMiddlewares(app);

// Set up application routes (e.g., API endpoints)
app.use(appRoutes);

// Set up Swagger UI for API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Set up process listeners for handling process termination signals
setupProcessListeners();

// Start the server and handle initialization
app.listen(PORT, async () => {
  try {
    const _BASE_URL = `http://localhost:${PORT}`;
    console.log(`${red}🚀 Server is running:${reset} ${blue}${_BASE_URL}${reset}`);
    console.log(`${green}📜 Swagger is available at:${reset} ${cyan}${_BASE_URL}/docs${reset}`);

    // Cleanup temporary files (e.g., after previous operations or server crashes)
    await cleanupTempFiles();

    // Create and seed the database if necessary (e.g., for development or testing)
    await createAndSeedDatabase();
  } catch (err) {
    console.error('❌ Error during server initialization:', err);
  }
}).on('error', (err) => {
  console.error(`${red}❌ Server failed to start:${reset}`, err);
});
