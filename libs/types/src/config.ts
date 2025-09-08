import { GatewayChannels } from './gateway';

export type PinoConfig = {
  level: string;
  pretty: boolean;
};

export type GatewayConfig = {
  cors: string;
  channels: GatewayChannels;
};

export type RedisConfig = {
  host: string;
  port: number;
};

export type QueueConfig = {
  firstQueue: string;
  secondQueue: string;
};

export type DashboardConfig = {
  socket: {
    url: string;
    token: string;
  };
};
