import { InjectQueue, OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { EventService } from '@queuetie/event';
import { RedisService } from '@queuetie/redis';
import { SimulateEcho } from '@queuetie/types';
import { Job, Queue } from 'bullmq';

@QueueEventsListener(process.env.FIRST_QUEUE_NAME)
export class MonitorService extends QueueEventsHost {
  private readonly logger = new Logger(MonitorService.name);

  constructor(
    @InjectQueue(process.env.FIRST_QUEUE_NAME)
    private readonly queue: Queue,
    private readonly redis: RedisService,
    private readonly eventService: EventService
  ) {
    super();
  }

  @OnQueueEvent('added')
  async onAdded({ jobId }) {
    const job: Job<SimulateEcho> | null = await this.queue.getJob(jobId as string);

    if (!job) {
      this.logger.warn(`Job ${jobId} could not be found, skipping`);
      return;
    }

    const { context, total, client } = job.data;

    const wasSet = await this.redis.setIfNotExists(`${context}-dispatching`, total);

    if (wasSet) {
      this.eventService.emitJobsDispatchingEvent({ clientId: client.id, dispatchedJobs: total });
    }
  }

  @OnQueueEvent('completed')
  async onCompleted({ jobId }) {
    const job: Job<SimulateEcho> | null = await this.queue.getJob(jobId as string);

    if (!job) {
      this.logger.warn(`Job ${jobId} could not be found, skipping`);
      return;
    }

    const { context, total, client } = job.data;

    const completed = await this.redis.increment(`${context}-completed`);

    const payload = {
      clientId: client.id,
      dispatchedJobs: total,
      completed,
      context,
    };

    if (completed == total) {
      this.eventService.emitJobsCompletedEvent(payload);
    } else {
      this.eventService.emitJobsProgressEvent(payload);
    }
  }
}
