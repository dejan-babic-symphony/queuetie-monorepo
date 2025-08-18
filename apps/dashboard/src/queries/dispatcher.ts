import { GatewayBroadcast, SimulateRequestType } from '@queuetie/types';
import { useMutation } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { DispatcherService } from '../services/dispatcher.service';

export const useDispatchSimulateMutation = () => {
  return useMutation({
    mutationFn: (payload: SimulateRequestType) => {
      return DispatcherService.single(payload);
    },
  });
};

export const useBroadcastMutation = () => {
  return useMutation<void, Error, { socket: Socket; broadcast: GatewayBroadcast }>({
    mutationFn: async ({ socket, broadcast }) => {
      socket.emit('queuetie.broadcast', broadcast);
    },
  });
};
