import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EventType,
  JobsCompletedEvent,
  JobsDispatchingEvent,
  JobsProgressEvent,
} from '@queuetie/types';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emitJobsDispatchingEvent(event: JobsDispatchingEvent) {
    this.eventEmitter.emit(EventType.JOBS_DISPATCHING, event);
  }

  public emitJobsProgressEvent(event: JobsProgressEvent) {
    this.eventEmitter.emit(EventType.JOBS_PROGRESS, event);
  }

  public emitJobsCompletedEvent(event: JobsCompletedEvent) {
    this.eventEmitter.emit(EventType.JOBS_COMPLETED, event);
  }
}
