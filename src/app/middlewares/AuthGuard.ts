import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { DecodedToken } from '@types';
import { AppError } from 'builders/errors';
import { DeveloperUser } from '__mocks__';

export class AuthGuard {
  /**
   * Extracts JWT token from request headers
   * @param req Express Request object
   * @throws AppError if token is not present
   * @returns JWT token string
   */
  private static extractToken(req: Request): string {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
      throw new AppError('Authentication token is required', 403);
    }

    return token;
  }

  /**
   * Checks if application is running in development mode
   * @returns true if in development mode, false otherwise
   */
  private static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Decodes and validates JWT token
   * @param token JWT token string
   * @throws AppError if token is invalid or malformed
   * @returns Decoded token payload
   */
  private static decodeToken(token: string): DecodedToken {
    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_TOKEN_KEY as string
      ) as DecodedToken;

      if (!decoded || !decoded.id) {
        throw new AppError('Invalid or malformed token', 401);
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid JWT token', 401);
      }
      throw error;
    }
  }

  /**
   * Validates decoded user data
   * @param user Decoded user information
   * @throws AppError if user data is invalid
   */
  private static validateUser(user: DecodedToken): void {
    if (!user || !user.id) {
      throw new AppError('User not authenticated', 401);
    }
  }

  /**
   * Authentication middleware handler
   * Validates JWT token and sets user information in request
   * 
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction
   * @throws AppError for authentication failures
   */
  public static handle(req: Request, res: Response, next: NextFunction): void {
    try {
      // Development environment bypass
      if (this.isDevelopment()) {
        req.user = DeveloperUser;
        return next();
      }

      const token = this.extractToken(req);

      // Production: validate and decode token
      const decoded = this.decodeToken(token);
      this.validateUser(decoded);
      
      req.user = decoded;
      next();
    } catch (error) {
      AppError.handleError(res, error);
    }
  }
}

export default AuthGuard.handle.bind(AuthGuard);;