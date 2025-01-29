import { Test, TestingModule } from '@nestjs/testing';
import { SocketService } from './socket.service';
import { ConfigModule } from '@nestjs/config';
import { gatewayConfig } from '@queuetie/config';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SocketService],
    }).compile();

    service = module.get<SocketService>(SocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
