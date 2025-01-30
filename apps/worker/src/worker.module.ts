import { Module } from '@nestjs/common';
import { BullmqModule } from '@queuetie/bullmq';
import { workerConfig } from '@queuetie/config';
import { ConfigModule } from '@nestjs/config';
import { FirstConsumer } from './first.consumer';
import { BullModule } from '@nestjs/bullmq';
import { SecondConsumer } from './second.consumer';
import { PinoModule } from '@queuetie/pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [workerConfig] }),
    PinoModule,
    BullmqModule,
    BullModule.registerQueue(
      { name: process.env.WORKER_FIRST_QUEUE },
      { name: process.env.WORKER_SECOND_QUEUE }
    ),
  ],
  providers: [FirstConsumer, SecondConsumer],
})
export class WorkerModule {}
