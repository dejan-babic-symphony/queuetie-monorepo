import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { authMiddleware } from './socket.middleware';
import { Server, Socket } from 'socket.io';
import { UUID } from 'crypto';
import { GatewayChannels, GatewayConfig, GatewayNotification } from '@queuetie/types';
import { ConfigService } from '@nestjs/config';
import { BroadcastRequestDto } from '../dto/broadcast.request.dto';
import { SocketFilter } from './socket.filter';

@WebSocketGateway({
  cors: {
    origin: process.env.GATEWAY_CORS_ORIGIN,
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(SocketService.name);
  private readonly clientSocketMap: Map<string, string> = new Map();
  private readonly channels: GatewayChannels;

  constructor(private readonly configService: ConfigService<GatewayConfig>) {
    this.channels = this.configService.get('channels');
  }

  afterInit(server: Server) {
    server.use(authMiddleware);
    this.logger.log({ channels: this.channels }, 'Server is ready');
  }

  handleConnection(socket: Socket) {
    const { clientid: clientId } = socket.handshake.headers;

    this.logger.log(`Socket created for clientId ${clientId}`);

    this.clientSocketMap.set(clientId as UUID, socket.id);
    socket.emit(this.channels.NOTIFICATION, 'QT connected');
  }

  handleDisconnect(socket: Socket) {
    for (const [clientId, socketId] of this.clientSocketMap) {
      if (socketId === socket.id) {
        this.logger.log(`Socket closed for clientId ${clientId}`);
        this.clientSocketMap.delete(clientId);
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
      this.sendMessageToClient(broadcast.target, broadcast.notification);
    }
  }

  sendProgressToClient(clientId: string, payload: any) {
    const socketId = this.clientSocketMap.get(clientId);
    if (socketId) {
      this.server.to(socketId).emit('progress', payload);
    } else {
      this.logger.error(`Client ${clientId} not found`);
    }
  }

  sendMessageToClient(clientId: string, notification: GatewayNotification) {
    const socketId = this.clientSocketMap.get(clientId);
    if (socketId) {
      this.logger.log(`Sending message to client ${clientId}`, { notification });
      this.server.to(socketId).emit(this.channels.NOTIFICATION, notification);
    } else {
      this.logger.error(`Client ${clientId} not found`);
    }
  }
}
