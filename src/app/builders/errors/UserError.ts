import { AppError } from "builders/errors";

export class UserError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
  }

  static default(): UserError {
    return new UserError("Something went wrong!");
  }

  static notFound(): UserError {
    return new UserError("User not found!", 404);
  }

  static invalidInput(): UserError {
    return new UserError("Invalid input provided.", 400);
  }

  static invalidToken(): UserError {
    return new UserError("Invalid or expired token provided.", 401);
  }

  static unauthorized(): UserError {
    return new UserError("Unauthorized access.", 401);
  }
  
  static creationFailed(): UserError {
    return new UserError("Failed to create the user.", 500);
  }

  static alreadyExists(): UserError {
    return new UserError("User already exists!", 409);
  }

  static alreadyLogged(): UserError {
    return new UserError("User already logged out", 200)
  }

  static updateFailed(): UserError {
    return new UserError("Failed to update the user.", 500);
  }

  static deletionFailed(): UserError {
    return new UserError("Failed to delete the user.", 500);
  }
}
