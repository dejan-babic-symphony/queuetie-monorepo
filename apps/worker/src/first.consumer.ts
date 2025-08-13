import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor(process.env.FIRST_QUEUE_NAME)
export class FirstConsumer extends WorkerHost {
  private readonly logger = new Logger(FirstConsumer.name);

  async process(job: Job): Promise<any> {
    await job.log(`Processed by ${process.env.HOSTNAME}`);
    this.logger.log({ payload: job.data }, 'Processing job on first queue');
    return 'ok';
  }
}
