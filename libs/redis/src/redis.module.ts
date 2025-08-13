import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from '@queuetie/config';
import { RedisClientToken, RedisFactory } from './redis.factory';
import { RedisService } from './redis.service';

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
  exports: [RedisService, RedisClientToken],
})
export class RedisModule {}
