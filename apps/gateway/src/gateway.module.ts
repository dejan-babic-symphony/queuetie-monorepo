import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { queueConfig } from '@queuetie/config';
import { gatewayConfig } from '@queuetie/config/gateway';
import { EventModule } from '@queuetie/event';
import { PinoModule } from '@queuetie/pino';
import { MonitorModule } from './monitor/monitor.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [gatewayConfig, queueConfig] }),
    EventModule,
    SocketModule,
    PinoModule,
    MonitorModule,
  ],
})
export class GatewayModule {}
