import { AppError } from 'builders/errors';

export class ReviewError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
  }

  static default(): ReviewError {
    return new ReviewError("Something went wrong!", 500);
  }

  static notFound(): ReviewError {
    return new ReviewError("Review not found!", 404);
  }

  static invalidInput(): ReviewError {
    return new ReviewError("Invalid input provided.", 400);
  }

  static unauthorized(): ReviewError {
    return new ReviewError("Unauthorized access.", 401);
  }

  static alreadyExists(): ReviewError {
    return new ReviewError("Review already exists!", 409);
  }
  
  static creationFailed(): ReviewError {
    return new ReviewError("Failed to create the review!", 409);
  }

  static updateFailed(): ReviewError {
    return new ReviewError("Failed to update the Review.", 500);
  }

  static deletionFailed(): ReviewError {
    return new ReviewError("Failed to delete the Review.", 500);
  }

}
