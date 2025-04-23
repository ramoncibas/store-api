import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';
import { AppError } from 'builders/errors';

interface KeyvConfig {
  uri: string;
  table: string;
  busyTimeout: number;
  namespace?: string;
}

class CacheConnection {
  private keyv!: KeyvSqlite;
  private cache!: Keyv;
  private readonly namespace: string;
  private databaseURL: string;

  constructor(tableName: string = 'default_cache') {
    this.databaseURL = process.env.DATABASE_CACHE_URL || 'redis://localhost:6379';
    this.namespace = process.env.NODE_ENV || 'development';
    this.initialize(tableName);
  }

  private initialize(tableName: string): void {
    try {
      const config: KeyvConfig = {
        uri: this.databaseURL,
        table: tableName,
        busyTimeout: 10000,
        namespace: this.namespace
      };

      this.keyv = new KeyvSqlite(config);
      this.cache = new Keyv({
        store: this.keyv,
        namespace: this.namespace
      });

      this.setupEventListeners();

    } catch (error) {
      AppError.internalError('Failed to initialize cache connection', error);

      return undefined;
    }
  }

  private setupEventListeners(): void {
    this.keyv.on('error', (error: Error) => {
      console.error('Cache connection error:', {
        message: error.message,
        namespace: this.namespace,
        timestamp: new Date().toISOString()
      });
    });
  }

  public getConnection(): Keyv {
    return this.cache;
  }

  public getNamespace(): string {
    return this.namespace;
  }

  public async disconnect(): Promise<void> {
    await this.cache.disconnect();
  }
}

export default CacheConnection;
