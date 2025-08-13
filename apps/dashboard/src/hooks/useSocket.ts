import { SimulateClient, SimulateOrganization } from '@queuetie/types';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (client: SimulateClient, organization: SimulateOrganization) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const token = 'let-me-in';

  useEffect(() => {
    const socket = io('localhost:3000', {
      extraHeaders: {
        token: token,
        clientId: client.id,
        clientName: client.name,
        organizationId: organization.id,
        organizationName: organization.name,
      },
    });

    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token, client, organization]);

  return { socket };
};
