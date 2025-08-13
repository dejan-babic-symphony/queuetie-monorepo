import { SimulateEcho, SimulateRequestType } from '@queuetie/types';
import clients from './clients';

const { dispatcherClient: httpClient } = clients;

export const DispatcherService = {
  single: (payload: SimulateRequestType): Promise<SimulateEcho> => {
    return httpClient.post('/dispatcher/simulate', payload);
  },
};
