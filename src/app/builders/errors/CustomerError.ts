import { AppError } from "builders/errors";

export class CustomerError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
  }

  static default(): CustomerError {
    return new CustomerError("Something went wrong!", 500);
  }

  static notFound(): CustomerError {
    return new CustomerError("Customer not found!", 404);
  }

  static invalidInput(): CustomerError {
    return new CustomerError("Invalid input provided.", 400);
  }

  static unauthorized(): CustomerError {
    return new CustomerError("Unauthorized access.", 401);
  }

  static alreadyExists(): CustomerError {
    return new CustomerError("Customer already exists!", 409);
  }
  
  static creationFailed(): CustomerError {
    return new CustomerError("Failed to create the customer.", 500);
  }

  static updateFailed(): CustomerError {
    return new CustomerError("Failed to update the customer.", 500);
  }

  static deletionFailed(): CustomerError {
    return new CustomerError("Failed to delete the customer.", 500);
  }
}
