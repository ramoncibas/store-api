class ReviewError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'ReviewError';
    this.cause = cause;

    // future implementation: Error.captureStackTrace(this, ReviewError);
  }

  cause?: Error;
}

export default ReviewError;