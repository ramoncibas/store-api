
export class Email {
  private address: string;

  constructor(address: unknown) {
    this.address = this.validate(address);
  }

  /**
   * Validates an email address and returns it if valid
   * @param address - The email address to validate
   * @returns The validated email address
   * @throws Error if the email address is invalid
   */
  validate(address: unknown): string {
    if (!address) {
      throw new Error('Email não pode ser vazio');
    }

    if (typeof address !== 'string') {
      throw new Error('Email deve ser uma string');
    }

    const trimmedAddress = address.trim();

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedAddress)) {
      throw new Error('Formato de email inválido');
    }

    const parts = trimmedAddress.split('@');
    if (parts.length !== 2 || !parts[1].includes('.')) {
      throw new Error('Formato de email inválido: domínio incorreto');
    }

    if (trimmedAddress.length > 254) {
      throw new Error('Email não pode ter mais que 254 caracteres');
    }

    return trimmedAddress;
  }

  /**
   * Returns the email address as a string
   * @returns The validated email address
   */
  toString(): string {
    return this.address;
  }

  /**
   * Returns the domain part of the email address
   * @returns The email domain
   */
  getDomain(): string {
    return this.address.split('@')[1];
  }

  /**
   * Returns the local part of the email address (before the @)
   * @returns The email local part
   */
  getLocalPart(): string {
    return this.address.split('@')[0];
  }

  /**
   * Checks if the email is from a corporate domain (not common free email providers)
   * @returns Whether the email is likely a corporate email
   */
  isCorporate(): boolean {
    const commonFreeProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'
    ];
    
    const domain = this.getDomain();
    return !commonFreeProviders.some(provider => domain.toLowerCase().endsWith(provider));
  }
}
