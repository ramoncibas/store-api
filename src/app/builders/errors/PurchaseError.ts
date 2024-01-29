class PurchaseError extends Error {
  private errorCode: number;
  private originalError?: any;

  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message);
    this.name = 'PurchaseError';
    this.errorCode = errorCode;
    this.originalError = error;
    this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  private logError(): void {
    if (this.originalError) {
      // using a logging library (sentry, or something)
      console.error(`PurchaseError: ${this.message}`, this.originalError);
    }
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.errorCode,
      message: this.message || PurchaseError.default(),
      data: null,
    };
  }

  static default(): PurchaseError {
    return new PurchaseError("Something went wrong!");
  }

  static notFound(): PurchaseError {
    return new PurchaseError("Purchase not found!", 404);
  }

  static invalidInput(): PurchaseError {
    return new PurchaseError("Invalid input provided.", 400);
  }

  static unauthorized(): PurchaseError {
    return new PurchaseError("Unauthorized access.", 401);
  }

  static creationFailed(): PurchaseError {
    return new PurchaseError("Failed to create the product.", 500);
  }

  static alreadyExists(): PurchaseError {
    return new PurchaseError("Purchase already exists!", 409);
  }

  static updateFailed(): PurchaseError {
    return new PurchaseError("Failed to update the product.", 500);
  }

  static deletionFailed(): PurchaseError {
    return new PurchaseError("Failed to delete the product.", 500);
  }
}

export default PurchaseError;
