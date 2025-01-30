import { WorkerConfig } from '@queuetie/types';
import { verify } from './utils';

export const workerConfig = (): WorkerConfig => {
  const configuration: WorkerConfig = {
    firstQueue: process.env.WORKER_FIRST_QUEUE,
    secondQueue: process.env.WORKER_SECOND_QUEUE,
  };

  verify(configuration);

  return configuration;
};
