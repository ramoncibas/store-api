import { AppError } from "builders/errors";

export class StockError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
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
    return new StockError("Product not found in stock!", 404);
  }

  /**
   * Returns a StockError indicating insufficient stock.
   * @returns A StockError instance with a 400 error code.
   */
  static insufficientStock(): StockError {
    return new StockError("Insufficient stock available.", 400);
  }

  /**
   * Returns a StockError indicating invalid input.
   * @returns A StockError instance with a 400 error code.
   */
  static invalidInput(): StockError {
    return new StockError("Invalid input provided.", 400);
  }

  /**
   * Returns a StockError indicating an invalid value.
   * @param value - The invalid value.
   * @returns A StockError instance with a 400 error code.
   */
  static invalidValue(value: string | number = ""): StockError {
    return new StockError(`Invalid input value for stock item: ${value}`, 400);
  }

  /**
   * Returns a StockError indicating unauthorized access.
   * @returns A StockError instance with a 401 error code.
   */
  static unauthorized(): StockError {
    return new StockError("Unauthorized access.", 401);
  }

  /**
   * Returns a StockError indicating that stock update failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockUpdateFailed(): StockError {
    return new StockError("Failed to update the stock.", 500);
  }

  /**
   * Returns a StockError indicating that stock reservation failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockReservationFailed(): StockError {
    return new StockError("Failed to reserve the stock.", 500);
  }

  /**
   * Returns a StockError indicating that stock release failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockReleaseFailed(): StockError {
    return new StockError("Failed to release the stock.", 500);
  }

  /**
   * Returns a StockError indicating that stock deduction failed.
   * @returns A StockError instance with a 500 error code.
   */
  static stockDeductionFailed(): StockError {
    return new StockError("Failed to deduct the stock.", 500);
  }
}
