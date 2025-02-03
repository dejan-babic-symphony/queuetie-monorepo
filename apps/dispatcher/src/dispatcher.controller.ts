import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { SimulateRequest } from './dto/simulate.request.dto';
import { SimulateResponse } from './dto/simulate.response.dto';
import { DispatcherSimulateDocs } from './docs/dispatcher.simulate.docs';

@Controller('dispatcher')
export class DispatcherController {
  private readonly logger = new Logger(DispatcherController.name);

  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post('/simulate')
  @DispatcherSimulateDocs()
  async simulate(@Body() payload: SimulateRequest): Promise<SimulateResponse> {
    this.logger.log({ payload }, 'Received request for simulating jobs');

    try {
      const echo = await this.dispatcherService.simulate(payload);
      this.logger.log({ echo }, 'Dispatched jobs');

      return echo;
    } catch (error: unknown) {
      this.logger.log({ error: error as Error }, 'Failed dispatching jobs');

      throw error;
    }
  }
}
