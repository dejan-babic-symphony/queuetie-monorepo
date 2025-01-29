import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from '@queuetie/types/config';

export const RedisClientToken = 'QueuetieRedisClient';

export const RedisFactory = (configService: ConfigService<RedisConfig>): Redis => {
  const host = configService.get<string>('host');
  const port = Number(configService.get<number>('port'));

  return new Redis({ host, port });
};
