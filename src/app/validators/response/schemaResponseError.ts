import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "builders/errors";

/**
 * Validates the request schema and throws an AppError if validation fails.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export default function schemaResponseError(req: Request, res: Response): void {
  const errors: any  = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error: any) => ({
      field: error?.path,
      type: error?.type,
      message: error?.msg,
      value: error?.value,
      location: error?.location,
    }));

    // Throw an AppError with a 400 status code and validation details
    throw new AppError(
      "Validation failed. Please check the input data.",
      400,
      null,
      { validationErrors }
    );
  }
}