import { ConfigService } from '@nestjs/config';
import { PinoConfig } from '@queuetie/types';
import { v4 as uuidv4 } from 'uuid';

export const LoggerFactory = (config: ConfigService<PinoConfig>) => {
  return {
    pinoHttp: {
      level: config.get('level') ?? 'info',
      genReqId: (request) => request.headers['x-correlation-id'] || uuidv4(),
      autoLogging: false,
      useExistingLogger: true,
      transport:
        config.get('pretty') === true
          ? {
              target: 'pino-pretty',
              options: {
                levelFirst: true,
                colorize: true,
                singleLine: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      serializers: {
        req: (req) => ({
          id: req.id,
          query: req.query,
          body: req.body,
          headers: {
            host: req.headers.host,
          },
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    },
  };
};
