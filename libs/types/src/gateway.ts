import { UUID } from 'crypto';
import { ExtendedError, Socket } from 'socket.io';

export type SocketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => void;

export type GatewayChannels = {
  BROADCAST: string;
  NOTIFICATION: string;
  PROGRESS: string;
};

export type GatewayNotificationType =
  | 'socket_connect'
  | 'socket_disconnect'
  | 'jobs_dispatching'
  | 'jobs_completed'
  | 'jobs_progress';

export type GatewayNotification = {
  type: GatewayNotificationType;
  message: string;
  from: string;
  timestamp: string;
};

export type GatewayProgress = {
  clientId: string;
  completed: number;
  context: string;
  dispatchedJobs: number;
};

export interface GatewayBroadcast {
  scope: 'client' | 'queuetie';
  target: UUID;
  notification: GatewayNotification;
}
