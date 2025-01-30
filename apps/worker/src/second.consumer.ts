import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor(process.env.WORKER_SECOND_QUEUE)
export class SecondConsumer extends WorkerHost {
  private readonly logger = new Logger(SecondConsumer.name);

  async process(job: Job): Promise<any> {
    job.log(`Processed by ${process.env.HOSTNAME}`);
    this.logger.log({ payload: job.data }, 'Processing job on second queue');
    return 'ok';
  }
}
