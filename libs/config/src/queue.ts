import { QueueConfig } from '@queuetie/types';
import { verify } from './utils';

export const queueConfig = (): QueueConfig => {
  const configuration: QueueConfig = {
    firstQueue: process.env.FIRST_QUEUE_NAME,
    secondQueue: process.env.SECOND_QUEUE_NAME,
  };

  verify(configuration);

  return configuration;
};
