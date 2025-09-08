import { SimulateClient, SimulateOrganization } from '@queuetie/types';
import { dashboardConfig } from '../config/dashboard';
import { useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (client: SimulateClient, organization: SimulateOrganization) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const config = useMemo(() => dashboardConfig(), []);

  useEffect(() => {
    const socket = io(config.socket.url, {
      extraHeaders: {
        token: config.socket.token,
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
  }, [config.socket.url, config.socket.token, client, organization]);

  return { socket };
};
