import { Injectable } from '@nestjs/common';

@Injectable()
export class DispatcherService {
  getHello(): string {
    return 'QT Dispatcher';
  }
}
