class CustomerError extends Error {
  private errorCode: number;
  private originalError?: any;

  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message);
    this.name = 'CustomerError';
    this.errorCode = errorCode;
    this.originalError = error;
    // this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`CustomerError: ${this.message}`, this.originalError);
  //   }
  // }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      type: "error",
      title: "Error",
      errorCode: this.errorCode,
      message: this.message || CustomerError.default(),
      data: null,
    };
  }

  static default(): CustomerError {
    return new CustomerError("Something went wrong!", undefined, 500);
  }

  static customerNotFound(): CustomerError {
    return new CustomerError("Customer not found!", undefined, 404);
  }

  static invalidInput(): CustomerError {
    return new CustomerError("Invalid input provided.", undefined, 400);
  }

  static unauthorized(): CustomerError {
    return new CustomerError("Unauthorized access.",undefined,  401);
  }

  static customerAlreadyExists(): CustomerError {
    return new CustomerError("Customer already exists!", undefined, 409);
  }

  static customerUpdateFailed(): CustomerError {
    return new CustomerError("Failed to update the customer.", undefined, 500);
  }

  static customerDeletionFailed(): CustomerError {
    return new CustomerError("Failed to delete the customer.", undefined, 500);
  }
}

export default CustomerError;
