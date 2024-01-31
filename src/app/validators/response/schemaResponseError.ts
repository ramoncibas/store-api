import { Request, Response } from "express";
import { validationResult } from "express-validator";
import ResponseBuilder from "builders/response/ResponseBuilder";

export default function schemaResponseError(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ResponseBuilder.send({
      response: res,
      title: "Error",
      type: "error",
      message: "Ops! Something is wrong",
      statusCode: 400,
      data: errors.array()
    });
  }
}
