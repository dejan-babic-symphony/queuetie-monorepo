import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientToken, RedisFactory } from './redis.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from '@queuetie/config';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    RedisService,
    {
      provide: RedisClientToken,
      useFactory: RedisFactory,
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
