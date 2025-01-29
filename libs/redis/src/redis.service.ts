import { Inject, Injectable } from '@nestjs/common';
import { RedisClientToken } from './redis.factory';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(RedisClientToken) private readonly redis: Redis) {}

  public increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }
}
