import { GatewayNotification, SimulateClient, SimulateOrganization } from '@queuetie/types';
import { createContext } from 'react';
import { GadgetContentType } from '../components/Gadget/types';
import { ProgressControl } from '../hooks/useProgressControl';

export type GadgetInstanceContextType = {
  socketOn: boolean;
  isGroup: boolean;
  activeContent: GadgetContentType;
  dispatchEnabled: boolean;
  client: SimulateClient | null;
  organization: SimulateOrganization | null;
  progressControls: Record<string, ProgressControl>;
  notifications: GatewayNotification[];
  handleToggleSocket: () => void;
  handleShowProgress: () => void;
  handleShowNotifications: () => void;
  handleSimulateDispatch: () => void;
  handleClearNotifications: () => void;
  handleGroupBroadcast: () => void;
  handleGroupAdd: () => void;
  handleGroupLeave: () => void;
  handleRemove: () => void;
};

export const GadgetInstanceContext = createContext<GadgetInstanceContextType | null>(null);
