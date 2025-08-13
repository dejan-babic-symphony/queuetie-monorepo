import { SimulateRequestType } from '@queuetie/types';
import { useMutation } from '@tanstack/react-query';
import { DispatcherService } from '../services/dispatcher.service';

export const useDispatchSimulateMutation = () => {
  return useMutation({
    mutationFn: (payload: SimulateRequestType) => {
      return DispatcherService.single(payload);
    },
  });
};
