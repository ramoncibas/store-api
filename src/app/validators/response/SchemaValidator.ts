import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { AppError } from "builders/errors";

export class SchemaValidator {

  /**
   * Validates the request schema and throws an AppError if validation fails
   * @param req The Express request object
   * @throws AppError with validation details if validation fails
   */
  private static validateRequest(req: Request): void {
    const errors: any  = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error: any) => ({
        field: error?.path,
        type: error?.type,
        message: error?.msg,
        value: error?.value,
        location: error?.location,
      }));
  
      throw new AppError(
        "Validation failed. Please check the input data.",
        400,
        null,
        { validationErrors }
      );
    }
  }

  /**
   * Combines validation execution with error formatting
   * @param validations Array of express-validator validation chains
   * @returns Array of Express middleware handlers
   */
  static validate(validations: ValidationChain[]): RequestHandler[] {
    const validateChains: RequestHandler = async (
      req: Request, 
      res: Response, 
      next: NextFunction
    ): Promise<void> => {
      try {
        await Promise.all(validations.map(validation => validation.run(req)));
        
        this.validateRequest(req);
        
        next();
      } catch (error) {
        if (error instanceof AppError) {
          AppError.handleError(res, error);
        }

        next(error);
      }
    };

    return [validateChains];
  }
}