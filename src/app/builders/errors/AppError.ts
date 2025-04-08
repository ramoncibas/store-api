import { Response } from "express";

interface AppErrorResponse {
  status: string;
  errorCode?: number;
  message: string;
  data?: Record<string, any> | null;
}

export class AppError extends Error {
  protected errorCode: number;
  protected originalError?: any;
  protected data?: Record<string, any>;
  private defaultMessage: string = "Something went wrong!";

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.originalError = error;
    this.data = data;

    // Captura stack trace excluindo o frame do construtor
    Error.captureStackTrace(this, this.constructor);
    this.logError();
  }

  /**
   * Logs the error details (can be integrated with external logging tools like Sentry).
   */
  protected logError(): void {
    if (this.originalError) {
      console.error(`${this.name}: ${this.message}`, this.originalError);
    }
  }

  /**
   * Gets the HTTP error code associated with this error.
   * @returns The error code.
   */
  protected getErrorCode(): number {
    return this.errorCode;
  }

  /**
   * Gets any additional error data.
   * @returns The error data or null.
   */
  protected getErrorData(): Record<string, any> | null {
    return this.data || null;
  }

  /**
   * Converts the error to a standardized response object.
   * @returns An object representing the error response.
   */
  protected toResponseObject(): AppErrorResponse {
    return {
      status: 'error',
      errorCode: this.getErrorCode(),
      message: this.message || this.defaultMessage,
      data: this.getErrorData(),
    };
  }

  /**
   * Handles the error and sends a response to the client.
   * @param res - The Express response object.
   * @param error - The error to handle.
   */
  static handleError(res: Response, error: AppError | any) {
    if (error instanceof AppError) {
      return res.status(error.getErrorCode()).json(error.toResponseObject());
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }

  static badRequest(message: string = "Bad request", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 400, error, data);
  }

  static unauthorized(message: string = "Unauthorized access", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 401, error, data);
  }

  static forbidden(message: string = "Forbidden", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 403, error, data);
  }

  static notFound(message: string = "Resource not found", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 404, error, data);
  }

  static conflict(message: string = "Resource conflict", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 409, error, data);
  }

  static internalError(message: string = "Internal server error", error?: any, data?: Record<string, any>): AppError {
    return new AppError(message, 500, error, data);
  }
}
