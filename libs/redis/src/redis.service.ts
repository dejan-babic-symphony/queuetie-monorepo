import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClientToken } from './redis.factory';

@Injectable()
export class RedisService {
  constructor(@Inject(RedisClientToken) private readonly redis: Redis) {}

  public async increment(key: string): Promise<number> {
    const setNow = await this.setIfNotExists(key, 1);
    if (setNow) {
      return 1;
    } else {
      return await this.redis.incr(key);
    }
  }

  async setIfNotExists(key: string, value: string | number): Promise<boolean> {
    const result = await this.redis.set(key, value, 'EX', 60, 'NX');
    return result === 'OK';
  }
}
