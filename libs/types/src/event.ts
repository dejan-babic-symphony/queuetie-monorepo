export enum EventType {
  JOBS_DISPATCHING = 'jobs.dispatching',
  JOBS_PROGRESS = 'jobs.progress',
  JOBS_COMPLETED = 'jobs.completed',
}

export type JobsDispatchingEvent = {
  clientId: string;
  dispatchedJobs: number;
};
export type JobsProgressEvent = JobsDispatchingEvent & {
  completed: number;
  context: string;
};
export type JobsCompletedEvent = JobsProgressEvent;
