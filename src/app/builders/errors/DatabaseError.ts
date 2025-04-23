import { AppError } from "builders/errors";

/**
 * Specialized class for handling database-related errors with detailed messages.
 * Extends the base AppError class to maintain consistent error handling.
 */
export class DatabaseError extends AppError {
  /**
   * Creates a new DatabaseError instance.
   * @param message - The error message.
   * @param errorCode - The HTTP status code (defaults to 500).
   * @param error - The original error object.
   * @param data - Additional error data.
   */
  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
  }

  /**
   * Creates an error for database connection failures.
   * @param error - The original connection error.
   * @returns A DatabaseError instance with connection failure details.
   */
  static connectionFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Unable to establish database connection. Please verify that the database is running and connection settings are correct.",
      500,
      error,
      { errorType: 'connection_failed' }
    );
  }

  /**
   * Creates an error for database connection closure failures.
   * @param error - The original closure error.
   * @returns A DatabaseError instance with connection closure failure details.
   */
  static connectionCloseFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Unable to close database connection. This may indicate pending transactions or active queries.",
      500,
      error,
      { errorType: 'connection_close_failed' }
    );
  }

  /**
   * Creates an error for query execution timeouts.
   * @param message - Custom timeout message (optional).
   * @param error - The original timeout error.
   * @returns A DatabaseError instance with timeout details.
   */
  static queryTimeout(message: string = "Query execution exceeded the time limit. Please optimize your query or check database load.", error?: any): DatabaseError {
    return new DatabaseError(
      message,
      408,
      error,
      { errorType: 'query_timeout' }
    );
  }

  /**
   * Creates an error for transaction failures.
   * @param error - The original transaction error.
   * @returns A DatabaseError instance with transaction failure details.
   */
  static transactionFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Transaction failed and was rolled back to maintain data consistency. Please check the operation and try again.",
      500,
      error,
      { errorType: 'transaction_failed' }
    );
  }

  /**
   * Creates an error for transaction start failures.
   * @param error - The original start transaction error.
   * @returns A DatabaseError instance with transaction start failure details.
   */
  static transactionStartFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Unable to start database transaction. Please ensure no other transaction is active and try again.",
      500,
      error,
      { errorType: 'transaction_start_failed' }
    );
  }

  /**
   * Creates an error for transaction commit failures.
   * @param error - The original commit error.
   * @returns A DatabaseError instance with commit failure details.
   */
  static commitFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Unable to commit transaction. Changes have been rolled back to maintain data consistency.",
      500,
      error,
      { errorType: 'commit_failed' }
    );
  }

  /**
   * Creates an error for transaction rollback failures.
   * @param error - The original rollback error.
   * @returns A DatabaseError instance with rollback failure details.
   */
  static rollbackFailed(error?: any): DatabaseError {
    return new DatabaseError(
      "Unable to rollback transaction. Database state may be inconsistent.",
      500,
      error,
      { errorType: 'rollback_failed' }
    );
  }

  /**
   * Creates an error when no active transaction is found.
   * @returns A DatabaseError instance with no active transaction details.
   */
  static noActiveTransaction(): DatabaseError {
    return new DatabaseError(
      "No active transaction found. Please ensure beginTransaction() is called before performing transactional operations.",
      400,
      null,
      { errorType: 'no_active_transaction' }
    );
  }

  /**
   * Creates an error when attempting to start a transaction while another is active.
   * @returns A DatabaseError instance with active transaction details.
   */
  static alreadyInTransaction(): DatabaseError {
    return new DatabaseError(
      "Cannot start new transaction: another transaction is already active. Please commit or rollback the current transaction first.",
      400,
      null,
      { errorType: 'already_in_transaction' }
    );
  }

  /**
   * Creates an error for database constraint violations.
   * @param constraint - The name of the violated constraint.
   * @param error - The original constraint violation error.
   * @returns A DatabaseError instance with constraint violation details.
   */
  static constraintViolation(constraint: string, error?: any): DatabaseError {
    return new DatabaseError(
      `Database constraint violation detected: ${constraint}. Please ensure your data meets the required constraints.`,
      400,
      error,
      { errorType: 'constraint_violation', constraint }
    );
  }

  /**
   * Creates an error for SQL syntax errors.
   * @param error - The original syntax error.
   * @returns A DatabaseError instance with syntax error details.
   */
  static syntaxError(error?: any): DatabaseError {
    return new DatabaseError(
      "Invalid SQL syntax detected in query. Please review your query structure and syntax.",
      400,
      error,
      { errorType: 'syntax_error' }
    );
  }

  /**
   * Creates an error when a record is not found in the database.
   * @param message - Custom not found message (optional).
   * @returns A DatabaseError instance with record not found details.
   */
  static recordNotFound(message: string = "The requested record could not be found in the database."): DatabaseError {
    return new DatabaseError(
      message,
      404,
      null,
      { errorType: 'record_not_found' }
    );
  }

  /**
   * Creates an error when the database connection pool is exhausted.
   * @returns A DatabaseError instance with connection pool exhaustion details.
   */
  static connectionPoolExhausted(): DatabaseError {
    return new DatabaseError(
      "Database connection pool is exhausted. Please try again later or consider increasing the pool size.",
      503,
      null,
      { errorType: 'connection_pool_exhausted' }
    );
  }
}
