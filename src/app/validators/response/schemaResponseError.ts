import { Request, Response } from "express";
import { validationResult } from "express-validator";

export default function schemaResponseError(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrorString = JSON.stringify(errors.array(), null, 2);

    throw new Error(`Validator Error: ${validationErrorString}`);
  }
}
