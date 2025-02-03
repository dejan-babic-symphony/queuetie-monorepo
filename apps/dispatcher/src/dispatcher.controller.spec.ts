import { Test, TestingModule } from '@nestjs/testing';
import { JobRequestMock, QueueDispatcherServiceMock } from './test.mocks';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';

describe('DispatcherController', () => {
  let controller: DispatcherController;

  const queueDispatcherServiceMock = { ...QueueDispatcherServiceMock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispatcherService],
      controllers: [DispatcherController],
    })
      .overrideProvider(DispatcherService)
      .useValue(queueDispatcherServiceMock)

      .compile();

    controller = module.get<DispatcherController>(DispatcherController);
  });

  it('should call simulate and return the echo', async () => {
    const payload = { ...JobRequestMock };

    queueDispatcherServiceMock.simulate.mockResolvedValueOnce(payload.echo);
    const result = await controller.simulate(payload);

    expect(queueDispatcherServiceMock.simulate).toHaveBeenCalledWith(payload);

    expect(result).toBe(payload.echo);
  });

  it('should log and re-throw the error on failure', async () => {
    const payload = { ...JobRequestMock };

    queueDispatcherServiceMock.simulate.mockRejectedValueOnce(new Error('Test Error'));
    await expect(controller.simulate(payload)).rejects.toThrow('Test Error');
  });
});
