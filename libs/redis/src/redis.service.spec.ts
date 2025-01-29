import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { RedisClientToken, RedisFactory } from './redis.factory';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

const RedisMock = {
  incr: jest.fn(),
};

describe('RedisService', () => {
  let service: RedisService;
  let redis: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: RedisClientToken,
          useFactory: RedisFactory,
          inject: [ConfigService],
        },
      ],
    })
      .overrideProvider(RedisClientToken)
      .useValue(RedisMock)
      .compile();

    service = module.get<RedisService>(RedisService);
    redis = module.get(RedisClientToken);
  });

  it('should call the redis client incr with the provided key', () => {
    service.increment('test');
    expect(redis.incr).toHaveBeenCalledWith('test');
  });
});
