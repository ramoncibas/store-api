import GenericError from "./GenericError";

class DatabaseError extends GenericError {
  constructor(message: string, errorCode: number = 500, error?: any) {
    super(message, errorCode, error);
    this.name = 'DatabaseError';
    this.logError();
  }

  // Método para registrar o erro (pode ser estendido para usar bibliotecas como Sentry, Winston, etc.)
  protected logError(): void {
    if (this.originalError) {
      console.error(`${this.name}: ${this.message}`, {
        errorCode: this.getErrorCode(),
        stack: this.stack,
        originalError: this.originalError,
      });
    }
  }

  // Método para formatar o erro como um objeto de resposta (útil para APIs)
  toResponseObject(includeStack: boolean = false): any {
    return {
      type: "error",
      title: this.name,
      errorCode: this.getErrorCode(),
      message: this.message,
      stack: includeStack ? this.stack : undefined, // Stack trace opcional
      data: null,
    };
  }

  // Métodos estáticos para erros comuns de banco de dados
  static connectionFailed(error?: any): DatabaseError {
    return new DatabaseError("Failed to connect to the database.", 500, error);
  }

  static queryFailed(error?: any): DatabaseError {
    return new DatabaseError("Database query failed.", 500, error);
  }

  static transactionFailed(error?: any): DatabaseError {
    return new DatabaseError("Database transaction failed.", 500, error);
  }

  static invalidQuery(error?: any): DatabaseError {
    return new DatabaseError("Invalid database query.", 400, error);
  }

  static recordNotFound(error?: any): DatabaseError {
    return new DatabaseError("Record not found in the database.", 404, error);
  }

  static duplicateEntry(error?: any): DatabaseError {
    return new DatabaseError("Duplicate entry detected.", 409, error);
  }

  static timeout(error?: any): DatabaseError {
    return new DatabaseError("Database operation timed out.", 504, error);
  }

  static constraintViolation(error?: any): DatabaseError {
    return new DatabaseError("Database constraint violation.", 400, error);
  }
}

export default DatabaseError;