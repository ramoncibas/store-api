import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from 'middlewares';
import express, { Application } from 'express';

/**
 * Configures and applies global middlewares for the Express application.
 *
 * @param {Application} app - The Express application instance.
 */
export default function setupMiddlewares(app: Application) {
  // Enable Cross-Origin Resource Sharing (CORS) to allow API access from different origins
  app.use(cors());

  // Secure the app by setting various HTTP headers
  app.use(helmet({ 
    frameguard: { action: 'deny' } // Prevents the app from being embedded in iframes (clickjacking protection)
  }));

  // HTTP request logger for development (logs requests to the console)
  app.use(morgan('dev'));

  // Parse incoming JSON requests with a size limit of 10KB
  app.use(express.json({ limit: '10kb' }));

  // Parse incoming URL-encoded payloads with a size limit of 10KB
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Rate Limiting: Prevents brute-force attacks & DDoS by limiting requests per IP
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute time window
    max: 100, // Maximum 100 requests per IP within the time window
    message: '⚠️ Too many requests, try again later.', // Response message for blocked requests
  }));

  // Global error handler to catch and process application errors
  app.use(errorHandler);
}
