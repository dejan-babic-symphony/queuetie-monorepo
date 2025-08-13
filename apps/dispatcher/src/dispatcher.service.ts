import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JobType } from './constants';
import { SimulateRequest } from './dto';

@Injectable()
export class DispatcherService {
  private readonly logger = new Logger(DispatcherService.name);

  constructor(
    @InjectQueue(process.env.FIRST_QUEUE_NAME)
    private readonly firstQueue: Queue,
    @InjectQueue(process.env.SECOND_QUEUE_NAME)
    private readonly secondQueue: Queue
  ) {}

  public async simulate(payload: SimulateRequest): Promise<SimulateRequest['echo']> {
    const { type, delay, queue, echo } = payload;

    const queueHandler = this.resolveHandler(queue);
    const resolvedName = this.resolveName(type);

    const addJobs = Array.from({ length: echo.total }).map(async () => {
      const randomDelay = Math.floor(Math.random() * delay) * 1000;

      await queueHandler.add(resolvedName, echo, {
        delay: randomDelay,
        removeOnComplete: { age: 60 },
        removeOnFail: { age: 60 },
      });
    });

    await Promise.all(addJobs);

    return echo;
  }

  private resolveHandler(name: string) {
    switch (name) {
      case process.env.FIRST_QUEUE_NAME:
        return this.firstQueue;
      case process.env.SECOND_QUEUE_NAME:
        return this.secondQueue;
      default:
        throw new BadRequestException(`Queue name [${name}] is not configured`);
    }
  }

  private resolveName(type: JobType) {
    switch (type) {
      case JobType.SINGLE:
        return 'Queuetie Job';
      default:
        throw new BadRequestException(`Job type [${type as string}] is not configured`);
    }
  }
}
