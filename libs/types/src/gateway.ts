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
  | 'jobs_progress'
  | 'broadcast_client'
  | 'broadcast_organization'
  | 'broadcast_queuetie'
  | 'gadget_join'
  | 'gadget_leave'
  | 'gadget_remove';

export type GatewayBroadcastType = 'client' | 'organization' | 'queuetie';

export type GatewayNotification = {
  type: GatewayNotificationType;
  message: string;
  from: string;
  timestamp: string;
};

export interface GatewayBroadcast {
  target: UUID;
  scope: GatewayBroadcastType;
  notification: GatewayNotification;
}

export type GatewayProgress = {
  clientId: string;
  completed: number;
  context: string;
  dispatchedJobs: number;
};
