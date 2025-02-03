import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '@queuetie/types';
import { QueueOptions } from 'bullmq';

export const BullmqFactory = (configService: ConfigService<RedisConfig>): QueueOptions => {
  const host = configService.get<string>('host');
  const port = configService.get<number>('port');
  const serviceConfig: QueueOptions = {
    connection: {
      host,
      port,
    },
    defaultJobOptions: {
      removeOnComplete: {
        age: 60 * 5,
      },
      removeOnFail: {
        age: 60 * 5,
      },
    },
  };

  return serviceConfig;
};
