import { DashboardConfig } from '@queuetie/types';

export const dashboardConfig = (): DashboardConfig => {
  return {
    socket: {
      url: import.meta.env.VITE_SOCKET_URL || 'localhost:3000',
      token: import.meta.env.VITE_SOCKET_TOKEN || 'let-me-in',
    },
  };
};
