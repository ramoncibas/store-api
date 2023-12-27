import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from "cors";
import cookiesMiddleware from 'universal-cookie-express';
// import session from "express-session";
import appRoutes from 'routes';

import { errorHandler } from "middlewares";
import cleanupTempFiles from "utils/cleanupTempFiles";

const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesMiddleware());
// app.use(session({secret: 'key'}));
app.use(errorHandler);
app.use(appRoutes);

app.listen(PORT, () => {
  cleanupTempFiles();
  console.log(`Server is running - Port: ${PORT}...`);
});
