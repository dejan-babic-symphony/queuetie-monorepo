import { UUID } from 'crypto';
import { Socket, ExtendedError } from 'socket.io';

type SocketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => void;

export type GatewayChannels = {
  BROADCAST: string;
  NOTIFICATION: string;
  PROGRESS: string;
};

export type GatewayNotification = {
  type: string;
  message: string;
};

export interface GatewayBroadcast {
  scope: 'client' | 'queuetie';
  target: UUID;
  notification: GatewayNotification;
}
