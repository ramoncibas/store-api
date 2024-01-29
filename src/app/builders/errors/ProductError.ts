class ProductError extends Error {
  private errorCode: number;
  private originalError?: any;

  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message);
    this.name = 'ProductError';
    this.errorCode = errorCode;
    this.originalError = error;
    this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  private logError(): void {
    if (this.originalError) {
      // using a logging library (sentry, or something)
      console.error(`ProductError: ${this.message}`, this.originalError);
    }
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.errorCode,
      message: this.message || ProductError.default(),
      data: null,
    };
  }

  static default(): ProductError {
    return new ProductError("Something went wrong!");
  }

  static productNotFound(): ProductError {
    return new ProductError("Product not found!", 404);
  }

  static invalidInput(): ProductError {
    return new ProductError("Invalid input provided.", 400);
  }

  static unauthorized(): ProductError {
    return new ProductError("Unauthorized access.", 401);
  }

  static productCreationFailed(): ProductError {
    return new ProductError("Failed to create the product.", 500);
  }

  static productAlreadyExists(): ProductError {
    return new ProductError("Product already exists!", 409);
  }

  static productUpdateFailed(): ProductError {
    return new ProductError("Failed to update the product.", 500);
  }

  static productDeletionFailed(): ProductError {
    return new ProductError("Failed to delete the product.", 500);
  }
}

export default ProductError;
