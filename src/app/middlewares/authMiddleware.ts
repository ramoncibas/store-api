import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@types';

const config = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.headers["x-access-token"] as string;

  if (process.env.NODE_ENV === 'development' || token === config.JWT_DEV_TOKEN) {
    req.user = {
      id: 1,
      email: 'store_development@gmail.com',
      username: 'store_development',
      role: 'admin',
    };
    
    return next();
  }

  if (!token) {
    res.status(403).send("A token is required for authentication");
    return;
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_TOKEN_KEY as string
    ) as DecodedToken;

    req.user = decoded;

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token inválido'
    });
  }
};

export default authMiddleware;
