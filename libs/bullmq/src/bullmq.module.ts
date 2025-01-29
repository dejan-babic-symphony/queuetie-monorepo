import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from '@queuetie/config';
import { BullModule } from '@nestjs/bullmq';
import { BullmqFactory } from './bullmq.factory';

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    BullModule.forRootAsync({
      useFactory: BullmqFactory,
      inject: [ConfigService],
    }),
  ],
})
export class BullmqModule {}
