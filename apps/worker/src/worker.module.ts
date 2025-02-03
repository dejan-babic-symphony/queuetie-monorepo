import { Module } from '@nestjs/common';
import { BullmqModule } from '@queuetie/bullmq';
import { queueConfig } from '@queuetie/config';
import { ConfigModule } from '@nestjs/config';
import { FirstConsumer } from './first.consumer';
import { BullModule } from '@nestjs/bullmq';
import { SecondConsumer } from './second.consumer';
import { PinoModule } from '@queuetie/pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [queueConfig] }),
    PinoModule,
    BullmqModule,
  ],
  providers: [FirstConsumer, SecondConsumer],
})
export class WorkerModule {}
