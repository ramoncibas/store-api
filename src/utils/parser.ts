import validator from 'validator';
import sanitize from 'sanitize-html';
import { AppError } from "builders/errors";

/**
 * Utility class for parsing and validating input values
 * Provides methods for type conversion and data sanitization
 */
export class Parser {
  /**
   * Sanitizes input string to prevent XSS attacks
   * @param value - Input string to sanitize
   * @throws AppError if value is empty or undefined
   */
  static sanitizeInput(value: string | undefined): string {
    if (!value) {
      throw new AppError('Value cannot be empty');
    }

    return sanitize(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  /**
   * Validates and sanitizes email addresses
   * @param value - Email string to validate 
   */
  static toEmail(value: string | undefined): string {
    const sanitizedValue = this.sanitizeInput(value);
    if (!validator.isEmail(sanitizedValue)) {
      throw new AppError(`Param must be a valid email`);
    }
    return sanitizedValue.toLowerCase();
  }

  /**
   * Validates and sanitizes URLs
   * @param value - URL string to validate
   */
  static toUrl(value: string | undefined): string {
    const sanitizedValue = this.sanitizeInput(value);
    if (!validator.isURL(sanitizedValue)) {
      throw new AppError(`Param must be a valid URL`);
    }
    return sanitizedValue;
  }

  /**
   * Validates JWT tokens
   * @param value - JWT token to validate
   */
  static toJWT(value: string | undefined): string {
    if (!value || !validator.isJWT(value)) {
      throw new AppError(`Param must be a valid JWT token`);
    }
    return value;
  }

  /**
   * Validates Brazilian CPF numbers
   * @param value - CPF string to validate
   */
  static toCPF(value: string | undefined): string {
    const cleaned = value?.replace(/[^\d]/g, '');
    if (!cleaned || cleaned.length !== 11) {
      throw new AppError(`Param must be a valid CPF`);
    }
    return cleaned;
  }

  /**
   * Validates and converts ISO 8601 date strings
   * @param value - Date string to validate
   */
  static toDate(value: string | undefined): Date {
    if (!value || !validator.isISO8601(value)) {
      throw new AppError(`Param must be a valid ISO 8601 date`);
    }
    return new Date(value);
  }

  /**
   * Validates and sanitizes strings with length and pattern constraints
   * @param value - String to validate
   * @param options - Validation options (minLength, maxLength, regex)
   */
  static toSafeString(
    value: string | undefined, 
    options: { 
      minLength?: number; 
      maxLength?: number; 
      regex?: RegExp 
    } = {}
  ): string {
    const sanitizedValue = this.sanitizeInput(value);
    const { minLength = 1, maxLength = 255, regex } = options;

    if (sanitizedValue.length < minLength) {
      throw new AppError(`Param must have at least ${minLength} characters`);
    }

    if (sanitizedValue.length > maxLength) {
      throw new AppError(`Param must have at most ${maxLength} characters`);
    }

    if (regex && !regex.test(sanitizedValue)) {
      throw new AppError(`Param has invalid format`);
    }

    return sanitizedValue;
  }

  /**
   * Validates numbers within a specified range
   * @param value - Number string to validate
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   */
  static toNumberInRange(
    value: string, 
    min: number, 
    max: number
  ): number {
    const num = this.toNumber(value);
    
    if (num < min || num > max) {
      throw new AppError(`Param must be between ${min} and ${max}`);
    }

    return num;
  }

  /**
   * Converts string to number
   * @param value - Number string to convert
   */
  static toNumber(value: string): number {
    return validator.toInt(value);
  }

  /**
   * Converts value to string
   * @param value - Value to convert to string
   */
  static toString(value: string | undefined): string {
    return validator.toString(value);
  }

  /**
   * Converts string to boolean
   * @param value - Boolean string to convert
   */
  static toBoolean(value: string): boolean {
    return validator.toBoolean(value);
  }
}

export default Parser;