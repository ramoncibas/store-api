// errorHandlingMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const statusCode = 500;
  const errorMessage = 'Erro interno do servidor';

  res.status(statusCode).json({ error: errorMessage });
}
