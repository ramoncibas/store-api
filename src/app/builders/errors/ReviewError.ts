import GenericError from "./GenericError";

class ReviewError extends GenericError {
  constructor(message: string, errorCode: number = 500, error?: any) {
    super(message, errorCode, error);
    this.name = 'ReviewError';
    // this.logError(); // future implementation: Error.captureStackTrace(this, ReviewError);
  }

  // private logError(): void {
  //   if (this.originalError) {
  //     // using a logging library (sentry, or something)
  //     console.error(`ReviewError: ${this.message}`, this.originalError);
  //   }
  // }

  toResponseObject(): any {
    return {
      type: "error",
      title: "Error",
      errorCode: this.getErrorCode(),
      message: this.message || ReviewError.default(),
      data: null,
    };
  }

  static default(): ReviewError {
    return new ReviewError("Something went wrong!", 500);
  }

  static reviewNotFound(): ReviewError {
    return new ReviewError("Review not found!", 404);
  }

  static invalidInput(): ReviewError {
    return new ReviewError("Invalid input provided.", 400);
  }

  static unauthorized(): ReviewError {
    return new ReviewError("Unauthorized access.", 401);
  }

  static reviewAlreadyExists(): ReviewError {
    return new ReviewError("Review already exists!", 409);
  }
  
  static reviewCreationFailed(): ReviewError {
    return new ReviewError("Failed to create the review!", 409);
  }

  static reviewUpdateFailed(): ReviewError {
    return new ReviewError("Failed to update the Review.", 500);
  }

  static reviewDeletionFailed(): ReviewError {
    return new ReviewError("Failed to delete the Review.", 500);
  }

}

export default ReviewError;
