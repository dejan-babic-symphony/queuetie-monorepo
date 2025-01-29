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
