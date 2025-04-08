import { AppError } from 'builders/errors';

export class PurchaseError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
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
