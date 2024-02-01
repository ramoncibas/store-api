import { Response } from "express";

class GenericError extends Error {
  private errorCode: number;
  private originalError?: any;

  constructor(message: string, errorCode: number = 500, error?: any) {
    super(message);
    this.name = 'GenericError';
    this.errorCode = errorCode;
    this.originalError = error;
    this.logError();
  }

  private logError(): void {
    if (this.originalError) {
      console.error(`${this.name}: ${this.message}`, this.originalError);
    }
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      status: 'error',
      errorCode: this.errorCode,
      message: this.message || GenericError.defaultMessage(),
      data: null,
    };
  }

  static handleError(res: Response, error: GenericError | any) {
    if (error instanceof GenericError) {
      res.status(error.getErrorCode()).json(error.toResponseObject());
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(error);
  }

  static defaultMessage(): string {
    return 'Something went wrong!';
  }
}

export default GenericError;
