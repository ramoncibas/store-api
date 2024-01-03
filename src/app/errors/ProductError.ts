class ProductError extends Error {
  cause?: Error;
  statusCode?: number;

  constructor(message: string, cause?: Error, statusCode?: number) {
    super(message);
    this.name = 'ProductError';
    this.cause = cause;
    this.statusCode = statusCode;

    // future implementation: Error.captureStackTrace(this, ProductError);
  }

  toResponseObject(): any {
    return {
      type: "error",
      title: this.name,
      message: this.message,
      statusCode: this.statusCode,
    };
  }

  static defaultMessage(): string {
    return "Something went wrong!";
  }

  static customerNotFoundMessage(): string {
    return "Customer not found!";
  }
}

export default ProductError;
