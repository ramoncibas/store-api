import Keyv from 'keyv';
import CacheConnection from './cache.connection';
import CacheHelper from './cache.helper';
import { AppError } from 'builders/errors';
import { CachedData } from './cache.types';

class CacheService extends CacheHelper {
  private readonly connection: CacheConnection;
  private readonly cache: Keyv;
  private readonly namespace: string;

  constructor(tableName: string) {
    super();

    this.connection = new CacheConnection(tableName);
    this.cache = this.connection.getConnection();
    this.namespace = this.connection.getNamespace() || 'development';
  }

  /**
   * Saves a value in the cache with a defined expiration time
   * @param key - The identifier key for the cache
   * @param value - The value to be stored (array or single item)
   * @param ttl - Time-to-live (TTL) in seconds (default: 15 minutes)
   */
  public async set<T>(key: string, value: T | T[], ttl: number = 15): Promise<boolean> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const namespacedKey = this.namespaceKey(this.namespace, sanitizedKey);

      if (!this.isSerializable(value)) {
        throw AppError.badRequest('Value cannot be serialized');
      }
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (ttl * 60 * 1000));
      const existingData = await this.get<T>(namespacedKey);

      const items = Array.isArray(value) ? value : [value];
      items.push(...(existingData?.items || []));
      
      const cacheItem: CachedData<T> = {
        items,
        metadata: {
          ttl,
          count: items.length,
          createdAt: existingData?.metadata?.createdAt || now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          updatedAt: now.toISOString()
        }
      };

      const compressed = this.compress(cacheItem);
      
      const expires = ttl * 60 * 1000;
      await this.cache.set(namespacedKey, compressed, expires);
      
      return true;
    } catch (error) {
      AppError.internalError('Failed to set cache value', error);

      return false;
    }
  }

  /**
   * Retrieves a stored value from the cache
   * @param key - The key of the item to retrieve
   * @returns The stored value or undefined if not found
   */
  public async get<T>(key: string): Promise<CachedData<T> | undefined> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const namespacedKey = this.namespaceKey(this.namespace, sanitizedKey);
      
      const compressed = await this.cache.get(namespacedKey);
      
      if (!compressed) return undefined;

      const cachedData = this.decompress(compressed) as CachedData<T>;
      const { createdAt, ttl } = cachedData.metadata;
      
      if (this.isExpired(new Date(createdAt).getTime(), ttl)) {
        await this.remove(namespacedKey);
        return undefined;
      }

      return cachedData ?? undefined;
    } catch (error) {
      throw AppError.internalError('Failed to get cache value', error);
    }
  }

  /**
   * Removes an item from the cache
   * @param key - The key of the item to be removed
   */
  public async remove(key: string): Promise<void> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const namespacedKey = this.namespaceKey(this.namespace, sanitizedKey);

      const exist = await this.get(namespacedKey);

      if (!exist) return;
      
      await this.cache.delete(namespacedKey);
    } catch (error) {
      AppError.internalError('Failed to remove cache item', error);
    }
  }

  /**
   * Clears the entire cache, removing all stored items
   */
  public async reset(): Promise<void> {
    try {
      await this.cache.clear();
    } catch (error) {
      AppError.internalError('Failed to reset cache', error);
    }
  }
}

export default CacheService;
