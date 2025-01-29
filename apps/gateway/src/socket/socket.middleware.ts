import { SocketMiddleware } from '@queuetie/types';

export const authMiddleware: SocketMiddleware = (socket, next) => {
  const { token, clientid } = socket.handshake.headers;

  const isAuthorized = Boolean(token === 'let-me-in' && clientid);

  if (!isAuthorized) {
    next(new Error('Unauthorized'));
  }
  //TODO[dejan.babic] Implement jwt auth
  next();
};
