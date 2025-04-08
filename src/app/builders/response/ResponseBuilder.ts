import { Response } from 'express';

interface ReponseSend {
  response: Response;
  message: string;
  statusCode: number;
  data?: any;
  type?: string;
  paginator?: string;
}

/**
 * ResponseBuilder class for creating consistent and structured JSON responses.
 */
export class ResponseBuilder<T> {
  /**
   * Static method to send a JSON response with a standardized structure.
   * @param response - Express Response object.
   * @param message - Custom message for the response.
   * @param statusCode - HTTP status code for the response.
   * @param data - Additional data to be included in the response (default: null).
   * @param type - Type of the response (default: 'success').
   * @param paginator - Page to rediretor user (default: '/home').
   * @example
   * // Return a data
   * ResponseBuilder.send({
        response: res,
        message: "The customer already exists in the database!",
        statusCode: 201
        data: customer,
        type = "info",
        paginator: "/home"
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
    paginator = '/'
  }: ReponseSend): void {
    response.status(statusCode).json({ type, message, paginator, data });
  }
}
