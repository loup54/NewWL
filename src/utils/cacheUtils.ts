
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    // Remove expired entries
    this.cleanup();

    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Could be enhanced with hit/miss tracking
    };
  }
}

export const documentCache = new CacheManager(50, 10 * 60 * 1000); // 10 minutes for documents
export const keywordCache = new CacheManager(100, 5 * 60 * 1000); // 5 minutes for keyword analysis

export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.join(':');
};

export const withCache = <T extends (...args: any[]) => any>(
  fn: T,
  cache: CacheManager,
  getKey: (...args: Parameters<T>) => string,
  ttl?: number
): T => {
  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    
    // Try to get from cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }
    
    // Execute function and cache result
    const result = fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  }) as T;
};
