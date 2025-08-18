import { GatewayNotification, SimulateClient, SimulateOrganization } from '@queuetie/types';
import { createContext } from 'react';
import { GadgetProgressProps } from '../components/Gadget/types';

export type GadgetContextType = {
  socketOn: boolean;
  isGroup: boolean;
  contentToggled: boolean;
  dispatchEnabled: boolean;
  client: SimulateClient | null;
  organization: SimulateOrganization | null;
  gadgetProgressProps: GadgetProgressProps[];
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
  gadgetProgressProps: [],
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
