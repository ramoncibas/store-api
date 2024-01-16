import dotenv from 'dotenv';
import config from 'config/environment';
dotenv.config(config.envFilePath);

import express, { Application } from 'express';
import cors from 'cors';
import cookiesMiddleware from 'universal-cookie-express';
// import session from 'express-session';
import appRoutes from 'routes';
import { errorHandler } from 'middlewares';

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger.json';
import cleanupTempFiles from 'utils/cleanupTempFiles';
import Seeder from 'lib/seeds';

const app: Application = express();
const seeds = new Seeder();

const { PORT = 5000 } = process.env;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesMiddleware());
// app.use(session({secret: 'key'}));
app.use(errorHandler);
app.use(appRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(PORT, () => {
  console.log(`Server is running - Port: ${PORT}...`);
  cleanupTempFiles();

  if (process.env.NODE_ENV === 'development') {
    seeds.createDatabase();
    seeds.seedDatabase(); 
  }
});
