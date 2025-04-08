import { AppError } from "builders/errors";

export class ProductError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
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
