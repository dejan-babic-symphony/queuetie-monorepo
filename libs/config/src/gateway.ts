import { GatewayConfig } from '@queuetie/types';
import { verify } from './utils';

export const gatewayConfig = (): GatewayConfig => {
  const configuration: GatewayConfig = {
    cors: process.env.GATEWAY_CORS_ORIGIN,
    channels: {
      BROADCAST: process.env.GATEWAY_SOCKET_CHANNEL_BROADCAST,
      NOTIFICATION: process.env.GATEWAY_SOCKET_CHANNEL_NOTIFICATION,
      PROGRESS: process.env.GATEWAY_SOCKET_CHANNEL_PROGRESS,
    },
  };

  verify(configuration);

  return configuration;
};
