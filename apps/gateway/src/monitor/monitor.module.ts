import { Module } from '@nestjs/common';
import { BullmqModule } from '@queuetie/bullmq';
import { RedisModule, RedisService } from '@queuetie/redis';
import { MonitorService } from './monitor.service';
import { EventService } from '@queuetie/event';

@Module({
  imports: [BullmqModule, RedisModule],
  providers: [MonitorService, RedisService, EventService],
})
export class MonitorModule {}
