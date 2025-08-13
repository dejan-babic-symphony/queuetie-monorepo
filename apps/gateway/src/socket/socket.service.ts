import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  EventType,
  GatewayChannels,
  GatewayConfig,
  GatewayNotification,
  GatewayNotificationType,
  GatewayProgress,
  JobsCompletedEvent,
  JobsDispatchingEvent,
  JobsProgressEvent,
  SimulateClient,
} from '@queuetie/types';
import { Server, Socket } from 'socket.io';
import { BroadcastRequestDto } from '../dto/broadcast.request.dto';
import { SocketFilter } from './socket.filter';
import { authMiddleware } from './socket.middleware';

@WebSocketGateway({
  cors: {
    origin: process.env.GATEWAY_CORS_ORIGIN,
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(SocketService.name);
  private readonly socketIdToClientMap: Map<string, SimulateClient> = new Map();
  private readonly clientIdToSocketIdMap: Map<string, string> = new Map();
  private readonly channels: GatewayChannels;

  constructor(private readonly configService: ConfigService<GatewayConfig>) {
    this.channels = this.configService.get('channels');
  }

  afterInit(server: Server) {
    server.use(authMiddleware);
    this.logger.log({ channels: this.channels }, 'Server is ready');
  }

  handleConnection(socket: Socket) {
    const clientId = Array.isArray(socket.handshake.headers.clientid)
      ? socket.handshake.headers.clientid[0]
      : socket.handshake.headers.clientid;

    const clientName = Array.isArray(socket.handshake.headers.clientname)
      ? socket.handshake.headers.clientname[0]
      : socket.handshake.headers.clientname;

    const client: SimulateClient = { id: clientId, name: clientName };

    this.logger.log(`Socket created for clientId ${clientId}`);

    this.socketIdToClientMap.set(socket.id, client);
    this.clientIdToSocketIdMap.set(clientId, socket.id);

    const notification = this.createNotification('Socket connected', 'socket_connect');

    this.sendNotificationToClient(clientId, notification);
  }

  handleDisconnect(socket: Socket) {
    for (const [socketId, client] of this.socketIdToClientMap) {
      if (socketId === socket.id) {
        this.logger.log(`Socket closed for clientId ${client.id}`);
        this.socketIdToClientMap.delete(socket.id);
        break;
      }
    }
  }

  @SubscribeMessage(process.env.GATEWAY_SOCKET_CHANNEL_BROADCAST)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseFilters(SocketFilter)
  handleBroadcast(@MessageBody() broadcast: BroadcastRequestDto) {
    this.logger.log({ broadcast }, 'Broadcasting');

    if (broadcast.scope === 'queuetie') {
      this.server.emit(this.channels.NOTIFICATION, broadcast.notification);
    }

    if (broadcast.scope === 'client') {
      this.sendNotificationToClient(broadcast.target, broadcast.notification);
    }
  }

  @OnEvent(EventType.JOBS_DISPATCHING)
  handleJobsDispatchingEvent(event: JobsDispatchingEvent) {
    this.logger.log({ event }, `Processing ${EventType.JOBS_DISPATCHING} event`);

    const { clientId, dispatchedJobs } = event;
    const socketId = this.clientIdToSocketIdMap.get(clientId);
    const client = this.socketIdToClientMap.get(socketId);

    const message = `Dispatched ${dispatchedJobs} job${dispatchedJobs > 1 ? 's' : ''}`;
    const notification = this.createNotification(message, 'jobs_dispatching', client.name);

    this.sendNotificationToClient(clientId, notification);
  }

  @OnEvent(EventType.JOBS_PROGRESS)
  handleJobsProgressEvent(event: JobsProgressEvent) {
    this.logger.log({ event }, `Processing ${EventType.JOBS_PROGRESS} event`);
    this.sendProgressToClient(event.clientId, event);
  }

  @OnEvent(EventType.JOBS_COMPLETED)
  handleJobsCompletedEvent(event: JobsCompletedEvent) {
    this.logger.log({ event }, `Processing ${EventType.JOBS_COMPLETED} event`);

    const { clientId, dispatchedJobs } = event;

    const message = `Processed ${dispatchedJobs} job${dispatchedJobs > 1 ? 's' : ''}`;
    const notification = this.createNotification(message, 'jobs_completed');

    this.sendProgressToClient(clientId, event);
    this.sendNotificationToClient(clientId, notification);
  }

  sendProgressToClient(clientId: string, progress: GatewayProgress) {
    const socketId = this.clientIdToSocketIdMap.get(clientId);
    if (socketId) {
      this.logger.log({ progress }, `Sending progress to client ${clientId}`);
      this.server.to(socketId).emit(this.channels.PROGRESS, progress);
    } else {
      this.logger.error(`Client ${clientId} not found`);
    }
  }

  sendNotificationToClient(clientId: string, notification: GatewayNotification) {
    const socketId = this.clientIdToSocketIdMap.get(clientId);
    if (socketId) {
      this.logger.log({ notification }, `Sending notification to client ${clientId}`);
      this.server.to(socketId).emit(this.channels.NOTIFICATION, notification);
    } else {
      this.logger.error(`Client ${clientId} not found`);
    }
  }

  private createNotification(
    message: string,
    type: GatewayNotificationType,
    from: string = 'Queuetie'
  ) {
    const notification: GatewayNotification = {
      message,
      type,
      from,
      timestamp: new Date().toISOString(),
    };

    return notification;
  }
}
