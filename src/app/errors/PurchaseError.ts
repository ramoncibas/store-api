class PurchaseError extends Error {
  cause?: Error;
  statusCode?: number;

  constructor(message: string, cause?: Error, statusCode?: number) {
    super(message);
    this.name = 'Purchase';
    this.cause = cause;
    this.statusCode = statusCode;

    // future implementation: Error.captureStackTrace(this, PurchaseError);
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

  static purchaseNotFoundMessage(): string {
    return "Purchase not found!";
  }
}

export default PurchaseError;
