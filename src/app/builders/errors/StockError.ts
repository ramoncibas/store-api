import GenericError from "./GenericError";

class StockError extends GenericError {
  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message, errorCode, error);
    this.name = 'StockError';
  }

  /**
   * Converts the error to a response object.
   * @returns An object representing the error response.
   */
  toResponseObject(): any {
    return {
      status: "error",
      errorCode: this.getErrorCode(),
      message: this.message || StockError.default().message,
      data: null,
    };
  }

  /**
   * Returns a default StockError.
   * @returns A default StockError instance.
   */
  static default(): StockError {
    return new StockError("Something went wrong!");
  }

  /**
   * Returns a StockError indicating that the product was not found.
   * @returns A StockError instance with a 404 error code.
   */
  static productNotFound(): StockError {
    return new StockError("Product not found in stock!", null, 404);
  }

  /**
   * Returns a StockError indicating insufficient stock.
   * @returns A StockError instance with a 400 error code.
   */
  static insufficientStock(): StockError {
    return new StockError("Insufficient stock available.", null, 400);
  }

  /**
   * Returns a StockError indicating invalid input.
   * @returns A StockError instance with a 400 error code.
   */
  static invalidInput(): StockError {
    return new StockError("Invalid input provided.", null, 400);
  }

  /**
   * Returns a StockError indicating an invalid value.
   * @param value - The invalid value.
   * @returns A StockError instance with a 400 error code.
   */
  static invalidValue(value: string | number = ""): StockError {
    return new StockError(`Invalid input value for stock item: ${value}`, null, 400);
  }

  /**
   * Returns a StockError indicating unauthorized access.
   * @returns A StockError instance with a 401 error code.
   */
  static unauthorized(): StockError {
    return new StockError("Unauthorized access.", null, 401);
  }

  /**
   * Returns a StockError indicating that stock update failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockUpdateFailed(): StockError {
    return new StockError("Failed to update the stock.", null, 500);
  }

  /**
   * Returns a StockError indicating that stock reservation failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockReservationFailed(): StockError {
    return new StockError("Failed to reserve the stock.", null, 500);
  }

  /**
   * Returns a StockError indicating that stock release failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockReleaseFailed(): StockError {
    return new StockError("Failed to release the stock.", null, 500);
  }

  /**
   * Returns a StockError indicating that stock deduction failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockDeductionFailed(): StockError {
    return new StockError("Failed to deduct the stock.", null, 500);
  }
}

export default StockError;