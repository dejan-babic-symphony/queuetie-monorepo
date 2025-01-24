import { Test, TestingModule } from '@nestjs/testing';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';

describe('DispatcherController', () => {
  let dispatcherController: DispatcherController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DispatcherController],
      providers: [DispatcherService],
    }).compile();

    dispatcherController = app.get<DispatcherController>(DispatcherController);
  });

  describe('root', () => {
    it('should return "QT Dispatcher"', () => {
      expect(dispatcherController.getHello()).toBe('QT Dispatcher');
    });
  });
});
