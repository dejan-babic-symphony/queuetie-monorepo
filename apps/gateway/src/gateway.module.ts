import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { PinoModule } from '@queuetie/pino';
import { ConfigModule } from '@nestjs/config';
import { gatewayConfig } from '@queuetie/config/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [gatewayConfig] }),
    SocketModule,
    PinoModule,
  ],
})
export class GatewayModule {}
