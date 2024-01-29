import dotenv from 'dotenv';
import config from 'config/environment';
dotenv.config(config.envFilePath);

import express, { Application } from 'express';
import cors from 'cors';
import cookiesMiddleware from 'universal-cookie-express';
// import session from 'express-session';
import appRoutes from 'routes';
import { errorHandler } from 'middlewares';
import { cleanupTempFiles, cleanupAndExit } from 'utils';
import Seeder from 'lib/seeds';

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger.json';

const { NODE_ENV = 'development', PORT = 5000 } = process.env;

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesMiddleware());
// app.use(session({secret: 'key'}));
app.use(errorHandler);
app.use(appRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

process.on('beforeExit', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

app.listen(PORT, () => {
  console.log(`Server is running - http://localhost:${PORT}`);
  console.log(`Swagger is running - http://localhost:${PORT}/docs`);
  cleanupTempFiles();

  if (NODE_ENV === 'development') {
    const seeds = new Seeder();
    seeds.createDatabase();
    seeds.seedDatabase();
  }
});
