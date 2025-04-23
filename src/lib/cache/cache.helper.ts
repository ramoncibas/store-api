import { AppError } from 'builders/errors';

class CacheHelper {
  constructor() { }

  /**
   * Generates a standardized cache key
   * @param prefix - Prefix for the key (e.g., 'user', 'product')
   * @param identifier - Unique identifier
   * @returns Formatted cache key
   */
  protected generateKey(prefix: string, identifier: string | number): string {
    return `${prefix}:${identifier}`.toLowerCase();
  }

  /**
   * Checks if a value is expired
   * @param timestamp - Timestamp to check
   * @param ttl - Time-to-live in minutes
   * @returns boolean indicating if value is expired
   */
  protected isExpired(timestamp: number, ttl: number): boolean {
    const now = Date.now();
    const expirationTime = timestamp + (ttl * 60 * 1000);
    return now > expirationTime;
  }

  /**
   * Sanitizes a cache key to prevent injection
   * @param key - Key to sanitize
   * @returns Sanitized key
   */
  protected sanitizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9:-_]/g, '');
  }

  /**
   * Compresses a value to save space
   * @param value - Value to compress
   * @returns Compressed string
   */
  protected compress(value: any): string {
    try {
      return Buffer.from(JSON.stringify(value)).toString('base64');
    } catch (error) {
      throw AppError.internalError('Failed to compress cache value', error);
    }
  }

  /**
   * Decompresses a stored value
   * @param value - Compressed value
   * @returns Original value
   */
  protected decompress(value: string): any {
    try {
      return JSON.parse(Buffer.from(value, 'base64').toString());
    } catch (error) {
      throw AppError.internalError('Failed to decompress cache value', error);
    }
  }

  /**
   * Creates a hash for the cache key
   * @param key - Key to hash
   * @returns Hashed key
   */
  protected hashKey(key: string): string {
    return require('crypto')
      .createHash('md5')
      .update(key)
      .digest('hex');
  }

  /**
   * Validates if the value is JSON serializable
   * @param value - Value to validate
   * @returns boolean indicating if value is serializable
   */
  protected isSerializable(value: any): boolean {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Creates a namespace for cache keys
   * @param namespace - Namespace to use
   * @param key - Original key
   * @returns Namespaced key
   */
  protected namespaceKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  /**
   * Validates cache parameters before operations
   * @param key - Cache key to validate
   * @param value - Cache value to validate
   * @param ttl - Time-to-live in minutes to validate
   * @throws AppError if any validation fails
   */
  protected validateParams(key: string, value: any, ttl: number): boolean {
    try {
      this.validateKey(key);
      this.validateValue(value);
      this.validateTTL(ttl);

      return true;
    } catch (error) {
      AppError.internalError('Cache validation error', error, {
        key,
        valueId: value?.id,
        ttl,
        error
      });

      return false;
    }
  }

  /**
   * Validates the cache key
   * @param key - Key to validate
   */
  private validateKey(key: string): void {
    if (!key) {
      throw AppError.badRequest('Cache key is required');
    }

    if (typeof key !== 'string') {
      throw AppError.badRequest('Cache key must be a string');
    }

    if (key.length > 255) {
      throw AppError.badRequest('Cache key exceeds maximum length of 255 characters');
    }
  }

  /**
   * Validates the cache value
   * @param value - Value to validate
   */
  private validateValue(value: any): void {
    if (!value) {
      throw AppError.badRequest('Cache value is required');
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw AppError.badRequest('Cache value must be an object');
    }

    if (!value.id) {
      throw AppError.badRequest('Cache item must have an id property');
    }

    if (typeof value.id !== 'string' && typeof value.id !== 'number') {
      throw AppError.badRequest('Cache item id must be a string or number');
    }

    const valueSize = JSON.stringify(value).length;
    if (valueSize > 1024 * 1024) { // 1MB
      throw AppError.badRequest('Cache value size exceeds maximum limit of 1MB');
    }
  }

  /**
   * Validates the TTL value
   * @param ttl - TTL to validate
   */
  private validateTTL(ttl: number): void {
    if (typeof ttl !== 'number') {
      throw AppError.badRequest('TTL must be a number');
    }

    if (ttl <= 0) {
      throw AppError.badRequest('TTL must be greater than 0');
    }

    if (ttl > 43200) { // 30 dias em minutos
      throw AppError.badRequest('TTL cannot exceed 30 days');
    }
  }
}

export default CacheHelper;
