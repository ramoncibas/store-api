import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';

class CacheService {
  private cache;
  private keyv;

  private databaseURL = process.env.DATABASE_CACHE_URL || 'redis://localhost:6379';
  private environment = process.env.NODE_ENV;

  constructor(tableName: string = 'default_cache') {
    // Initializes Keyv with SQLite storage
    this.keyv = new KeyvSqlite({
      uri: this.databaseURL,
      table: tableName,
      busyTimeout: 10000
    });

    this.cache = new Keyv({
      store: this.keyv,
      namespace: this.environment
    });

    this.keyv.on('error', (error) => {
      console.error('Connection Error:', error);
    });
  }

  /**
   * Saves a value in the cache with a defined expiration time
   * @param key - The identifier key for the cache
   * @param value - The value to be stored
   * @param ttl - Time-to-live (TTL) in seconds (default: 15 minutes)
   */
  public async set<T>(key: string, value: T, ttl: number = 15): Promise<any> {
    const expires = ttl * 60 * 1000;
    const saved = await this.cache.set(key, value, expires);
    return saved;
  }

  /**
   * Retrieves a stored value from the cache
   * @param key - The key of the item to retrieve
   * @returns The stored value or undefined if not found
   */
  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cache.get(key);
    return value;
  }

  /**
   * Removes an item from the cache
   * @param key - The key of the item to be removed
   */
  public async remove(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  /**
   * Clears the entire cache, removing all stored items
   */
  public async reset(): Promise<void> {
    await this.cache.clear();
  }
}

export default CacheService;
