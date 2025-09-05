import { GatewayNotification, SimulateClient, SimulateOrganization } from '@queuetie/types';
import { createContext } from 'react';
import { ProgressControl } from '../hooks/useProgressControl';

export type GadgetContextType = {
  socketOn: boolean;
  isGroup: boolean;
  contentToggled: boolean;
  dispatchEnabled: boolean;
  client: SimulateClient | null;
  organization: SimulateOrganization | null;
  progressControls: Record<string, ProgressControl>;
  notifications: GatewayNotification[];
  handleToggleSocket: () => void;
  handleContentToggle: () => void;
  handleSimulateDispatch: () => void;
  handleClearNotifications: () => void;
  handleGroupBroadcast: () => void;
  handleGroupAdd: () => void;
  handleGroupLeave: () => void;
  handleRemove: () => void;
};

export const GadgetContext = createContext<GadgetContextType>({
  socketOn: false,
  isGroup: false,
  contentToggled: false,
  dispatchEnabled: false,
  client: null,
  organization: null,
  progressControls: {},
  notifications: [],
  handleToggleSocket: () => {},
  handleContentToggle: () => {},
  handleSimulateDispatch: () => {},
  handleClearNotifications: () => {},
  handleGroupBroadcast: () => {},
  handleGroupAdd: () => {},
  handleGroupLeave: () => {},
  handleRemove: () => {},
});
