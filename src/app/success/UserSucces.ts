class SuccessMessage {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }

  toResponseObject(): any {
    return {
      status: "success",
      title: "Succes",
      message: this.message,
      data: null, 
    };
  }

  static defaultSuccess(): SuccessMessage {
    return new SuccessMessage("Operation completed successfully!");
  }

  static customerCreatedSuccess(): SuccessMessage {
    return new SuccessMessage("Customer created successfully!");
  }

  static reviewCreatedSuccess(): SuccessMessage {
    return new SuccessMessage("Review created successfully!");
  }

  static customerUpdatedSuccess(): SuccessMessage {
    return new SuccessMessage("Customer updated successfully!");
  }

  static customerDeletedSuccess(): SuccessMessage {
    return new SuccessMessage("Customer deleted successfully!");
  }
}

export default SuccessMessage;
