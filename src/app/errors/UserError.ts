class UserError extends Error {
  private errorCode: number;

  constructor(message: string, error?: any, errorCode: number = 500) {
    super(message);
    this.name = 'UserError';
    this.errorCode = errorCode;

    if (error) {
      // Log the original error for debugging purposes
      console.error(`UserError: ${message}`, error);
    }
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  toResponseObject(): any {
    return {
      type: "error",
      title: this.name,
      message: this.message
    };
  }

  static defaultMessage(): string {
    return "Something went wrong!";
  }

  static userNotFoundMessage(): string {
    return "User not found!";
  }
}

export default UserError;
