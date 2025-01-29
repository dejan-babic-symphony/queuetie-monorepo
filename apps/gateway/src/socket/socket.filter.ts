import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(BadRequestException)
export class SocketFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const response = exception.getResponse();

    // Format error response
    const errorMessage =
      typeof response === 'string' ? response : response['message'] || 'Bad request';

    // Emit WebSocket error event
    client.emit(process.env.GATEWAY_SOCKET_CHANNEL_NOTIFICATION, new WsException(errorMessage));
  }
}
