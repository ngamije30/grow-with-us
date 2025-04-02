import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

const redis = new Redis(process.env.REDIS_URL);

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

export class RateLimitService {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  middleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = `${this.config.keyPrefix}:${req.ip}`;
    
    try {
      const requests = await redis.incr(key);
      
      if (requests === 1) {
        await redis.expire(key, this.config.windowMs / 1000);
      }

      if (requests > this.config.max) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: await redis.ttl(key),
        });
      }

      res.setHeader('X-RateLimit-Limit', this.config.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.max - requests));
      
      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      next();
    }
  };
}

export const createRateLimiter = (config: Partial<RateLimitConfig> = {}) => {
  const defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    keyPrefix: 'rl',
  };

  return new RateLimitService({ ...defaultConfig, ...config });
};