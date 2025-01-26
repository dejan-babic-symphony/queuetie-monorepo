import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { pinoConfig } from '@queuetie/config/pino';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerFactory } from './pino.factory';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
