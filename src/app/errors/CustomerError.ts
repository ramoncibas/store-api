class CustomerError extends Error {
  cause?: Error;
  statusCode?: number;

  constructor(message: string, cause?: Error, statusCode?: number) {
    super(message);
    this.name = 'CustomerError';
    this.cause = cause;
    this.statusCode = statusCode;

    // future implementation: Error.captureStackTrace(this, CustomerError);
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

export default CustomerError;
