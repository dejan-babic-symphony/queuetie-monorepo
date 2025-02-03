import { Module } from '@nestjs/common';
import { BullmqModule } from '@queuetie/bullmq';
import { queueConfig } from '@queuetie/config';
import { ConfigModule } from '@nestjs/config';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';
import { PinoModule } from '@queuetie/pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [queueConfig] }),
    PinoModule,
    BullmqModule,
  ],
  exports: [DispatcherService],
  controllers: [DispatcherController],
  providers: [DispatcherService],
})
export class DispatcherModule {}
