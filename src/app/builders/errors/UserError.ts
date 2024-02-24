import GenericError from "./GenericError";

class UserError extends GenericError {
  constructor(message: string, errorCode: number = 500, error?: any) {
    super(message, errorCode, error);
    this.name = 'UserError';
    // this.logError(); // future implementation: Error.captureStackTrace(this, CustomerError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`UserError: ${this.message}`, this.originalError);
  //   }
  // }

  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.getErrorCode(),
      message: this.message || UserError.default(),
      data: null,
    };
  }

  static default(): UserError {
    return new UserError("Something went wrong!");
  }

  static userNotFound(): UserError {
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
  
  static userCreationFailed(): UserError {
    return new UserError("Failed to create the user.", 500);
  }

  static userAlreadyExists(): UserError {
    return new UserError("User already exists!", 409);
  }

  static userAlreadyLogged(): UserError {
    return new UserError("User already logged out", 200)
  }

  static userUpdateFailed(): UserError {
    return new UserError("Failed to update the user.", 500);
  }

  static userDeletionFailed(): UserError {
    return new UserError("Failed to delete the user.", 500);
  }
}

export default UserError;
