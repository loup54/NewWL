
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id) => id,
      ...config
    };
  }

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = this.config.keyGenerator!(identifier);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    let entry = this.store.get(key);
    
    if (!entry) {
      // First request for this identifier
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
      this.store.set(key, entry);
      
      return {
        allowed: true,
        resetTime: entry.resetTime,
        remaining: this.config.maxRequests - 1
      };
    }
    
    if (now >= entry.resetTime) {
      // Window has expired, reset
      entry.count = 1;
      entry.resetTime = now + this.config.windowMs;
      
      return {
        allowed: true,
        resetTime: entry.resetTime,
        remaining: this.config.maxRequests - 1
      };
    }
    
    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0
      };
    }
    
    // Increment count
    entry.count++;
    
    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: this.config.maxRequests - entry.count
    };
  }

  private cleanup(now: number) {
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  reset(identifier?: string) {
    if (identifier) {
      const key = this.config.keyGenerator!(identifier);
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  voucherGeneration: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (userId) => `voucher_gen:${userId}`
  }),
  
  voucherRedemption: new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (userId) => `voucher_redeem:${userId}`
  }),
  
  payment: new RateLimiter({
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (userId) => `payment:${userId}`
  }),
  
  auth: new RateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (email) => `auth:${email}`
  })
};
