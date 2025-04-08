export interface CacheItem {
  id: number | string;
  [key: string]: any;
}

export interface CacheMetadata {
  ttl: number;
  count?: number;
  createdAt: string;
  updatedAt?: string;
  expiresAt: string;
}

export interface CachedData<T> {
  items: T[];
  metadata: CacheMetadata;
}