import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

const config = process.env;

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.headers["x-access-token"] as string;
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    next();
    return;
  }

  if (!token) {
    res.status(403).send("A token is required for authentication");
    return;
  }

  if (token === config.JWT_DEV_TOKEN) {
    req.user = { username: 'store_development' };
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_TOKEN_KEY as string);
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid Token");
    return;
  }
};

export default authMiddleware;
