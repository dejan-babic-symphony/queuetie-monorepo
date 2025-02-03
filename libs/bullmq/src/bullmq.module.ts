import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from '@queuetie/config';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { BullmqFactory } from './bullmq.factory';

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    BullModule.forRootAsync({
      useFactory: BullmqFactory,
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: process.env.FIRST_QUEUE_NAME },
      { name: process.env.SECOND_QUEUE_NAME }
    ),
  ],
  exports: [BullModule],
})
export class BullmqModule {}
