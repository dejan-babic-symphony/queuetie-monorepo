export type RedisConfig = {
  host: string;
  port: number;
};

export type QueueConfig = {
  events: string;
  first: string;
  second: string;
};

export type EmitterConfig = {
  channel: string;
};

export type QueuetieServiceConfig = {
  redis: RedisConfig;
  queue: QueueConfig;
  emitter: EmitterConfig;
};
