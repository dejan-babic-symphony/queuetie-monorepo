import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerFactory } from './pino.factory';
import { pinoConfig } from '@queuetie/config';

@Module({
  imports: [
    ConfigModule.forFeature(pinoConfig),
    PinoLoggerModule.forRootAsync({
      useFactory: LoggerFactory,
      inject: [ConfigService],
    }),
  ],
  exports: [PinoLoggerModule],
  providers: [ConfigService],
})
export class PinoModule {}
