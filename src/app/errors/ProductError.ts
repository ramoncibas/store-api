class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductError';

    // future implementation: Error.captureStackTrace(this, ProductError);
  }
}

export default ProductError;
