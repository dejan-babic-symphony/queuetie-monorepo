import { RedisConfig } from '@queuetie/types';
import { verify } from './utils';

export const redisConfig = (): RedisConfig => {
  const configuration: RedisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  };

  verify(configuration);

  return configuration;
};
