import GenericError from "./GenericError";

class ShoppingCartError extends GenericError {
  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message, errorCode, error);
    this.name = 'ShoppingCartError';
    // this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`ShoppingCartError: ${this.message}`, this.originalError);
  //   }
  // }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.getErrorCode(),
      message: this.message || ShoppingCartError.default(),
      data: null,
    };
  }

  static default(): ShoppingCartError {
    return new ShoppingCartError("Something went wrong!");
  }

  static itemNotFound(): ShoppingCartError {
    return new ShoppingCartError("Shopping Cart Item not found!", 404);
  }

  static invalidInput(): ShoppingCartError {
    return new ShoppingCartError("Invalid input provided.", 400);
  }

  static invalidValue(value: string | number = ""): ShoppingCartError {
    return new ShoppingCartError(`Invalid input value for shopping cart item: ${value}`, 400);
  }

  static isEmpty(): ShoppingCartError {
    return new ShoppingCartError("Shopping Cart is empty", 400);
  }

  static unauthorized(): ShoppingCartError {
    return new ShoppingCartError("Unauthorized access.", 401);
  }

  static itemCreationFailed(): ShoppingCartError {
    return new ShoppingCartError("Failed to create the product.", 500);
  }

  static itemAlreadyExists(): ShoppingCartError {
    return new ShoppingCartError("Shopping Cart Item already exists!", 409);
  }

  static itemUpdateFailed(): ShoppingCartError {
    return new ShoppingCartError("Failed to update the product.", 500);
  }

  static itemDeletionFailed(): ShoppingCartError {
    return new ShoppingCartError("Failed to delete the product.", 500);
  }
}

export default ShoppingCartError;
