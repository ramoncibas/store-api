import GenericError from "./GenericError";

class CustomerError extends GenericError {
  constructor(message: string, errorCode: number = 500, error?: any) {
    super(message, errorCode);
    this.name = 'CustomerError';
    // this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`CustomerError: ${this.message}`, this.originalError);
  //   }
  // }

  toResponseObject(): any {
    return {
      type: "error",
      title: "Error",
      errorCode: this.getErrorCode(),
      message: this.message || CustomerError.default(),
      data: null,
    };
  }

  static default(): CustomerError {
    return new CustomerError("Something went wrong!", 500);
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
  
  static customerCreationFailed(): CustomerError {
    return new CustomerError("Failed to create the customer.", 500);
  }

  static customerUpdateFailed(): CustomerError {
    return new CustomerError("Failed to update the customer.", 500);
  }

  static customerDeletionFailed(): CustomerError {
    return new CustomerError("Failed to delete the customer.", 500);
  }
}

export default CustomerError;
