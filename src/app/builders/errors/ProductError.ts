import GenericError from "./GenericError";

class ProductError extends GenericError {
  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message, errorCode, error);
    this.name = 'ProductError';
    // this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`ProductError: ${this.message}`, this.originalError);
  //   }
  // }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.getErrorCode(),
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
