type EnvSchema = {
  HOSTNAME: string;
  NODE_ENV: string;
  LOGGER_LEVEL: string;
  LOGGER_PRETTY: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;
  FIRST_QUEUE_NAME: string;
  SECOND_QUEUE_NAME: string;
  GATEWAY_CORS_ORIGIN: string;
  GATEWAY_SOCKET_CHANNEL_BROADCAST: string;
  GATEWAY_SOCKET_CHANNEL_NOTIFICATION: string;
  GATEWAY_SOCKET_CHANNEL_PROGRESS: string;
  VITE_SOCKET_URL: string;
  VITE_SOCKET_TOKEN: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends Record<keyof EnvSchema, string | undefined> {}
  }
}

export * from './pino';
export * from './gateway';
export * from './redis';
export * from './queue';
