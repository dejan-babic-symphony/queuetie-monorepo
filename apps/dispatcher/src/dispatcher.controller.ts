import { Controller, Get } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';

@Controller()
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Get()
  getHello(): string {
    return this.dispatcherService.getHello();
  }
}
