import { Response } from 'express';

interface ReponseSend {
  response: Response;
  message: string;
  statusCode: number;
  data?: any;
  type?: string;
  title?: string;
}

/**
 * ResponseBuilder class for creating consistent and structured JSON responses.
 */
class ResponseBuilder {
  /**
   * Static method to send a JSON response with a standardized structure.
   * @param response - Express Response object.
   * @param message - Custom message for the response.
   * @param statusCode - HTTP status code for the response.
   * @param data - Additional data to be included in the response (default: null).
   * @param type - Type of the response (default: 'success').
   * @param title - Title of the response (default: 'Success').
   * @example
   * // Return a data
   * ResponseBuilder.send({
        type = "info",
        title = "Customer allready created",
        message: "The customer already exists in the database!",
        data: customer,
        response: res,
        statusCode: 201
    });
   *
   * // Default value
   * ResponseBuilder.send({
        message: "Customer created successfully!",
        response: res,
        statusCode: 201
    });
   */
  static send({
    response,
    message,
    statusCode,
    data = null,
    type = 'success',
    title = 'Success'
  }: ReponseSend): void {
    response.status(statusCode).json({ type, title, message, statusCode, data });
  }
}

export default ResponseBuilder;
