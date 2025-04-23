import { Response } from 'express';

type ResponseType = 'success' | 'error' | 'info';

type ReponseSend = {
  response: Response;
  message: string;
  statusCode: number;
  data?: any;
  type?: ResponseType;
  paginator?: string;
};

/**
 * ResponseBuilder class for creating consistent and structured JSON responses.
 */
export class ResponseBuilder<T> {
  /**
   * Logs details (can be integrated with external logging tools like Sentry).
   */
  protected static logInfo({
    response,
    message,
    statusCode,
    data,
    type,
    paginator
  }: ReponseSend): void {
    const { method, originalUrl, ip, headers } = response.req || {};
    const userAgent = headers?.['user-agent'];
  
    console.info('🟢 [INFO]', {
      timestamp: new Date().toISOString(),
      request: {
        method,
        path: originalUrl,
        ip,
        userAgent,
      },
      response: {
        statusCode,
        type,
        message,
        paginator,
        data,
      }
    });
  }

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
    this.logInfo({
      response,
      message,
      statusCode,
      data,
      type,
      paginator
    });

    response.status(statusCode).json({ type, message, paginator, data });
  }
}
