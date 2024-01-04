class CustomerError extends Error {
  private errorCode: number;
  private originalError?: any;

  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message);
    this.name = 'CustomerError';
    this.errorCode = errorCode;
    this.originalError = error;
    this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  private logError(): void {
    if (this.originalError) {
      // using a logging library (sentry, or something)
      console.error(`CustomerError: ${this.message}`, this.originalError);
    }
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.errorCode,
      message: this.message || CustomerError.default(),
      data: null,
    };
  }

  static default(): CustomerError {
    return new CustomerError("Something went wrong!");
  }

  static customerNotFound(): CustomerError {
    return new CustomerError("Customer not found!", 404);
  }

  static invalidInput(): CustomerError {
    return new CustomerError("Invalid input provided.", 400);
  }

  static unauthorized(): CustomerError {
    return new CustomerError("Unauthorized access.", 401);
  }

  static customerAlreadyExists(): CustomerError {
    return new CustomerError("Customer already exists!", 409);
  }

  static customerUpdateFailed(): CustomerError {
    return new CustomerError("Failed to update the customer.", 500);
  }

  static customerDeletionFailed(): CustomerError {
    return new CustomerError("Failed to delete the customer.", 500);
  }
}

export default CustomerError;
