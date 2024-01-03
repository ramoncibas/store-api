import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

const config = process.env;

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.headers["x-access-token"] as string;

  if (!token) {
    res.status(403).send("A token is required for authentication");
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
