import { GatewayNotification } from '@queuetie/types';
import { ReactElement } from 'react';
import { GadgetNotifications } from './GadgetNotifications';
import { GadgetProgressGrid } from './GadgetProgressGrid';

export type GadgetGridProps = {
  show: boolean;
  gadgets: GadgetProps[];
  onReorder: (gadgets: GadgetProps[]) => void;
};

export type GadgetEntity = {
  id: string;
  name: string;
};

export type GadgetProps = {
  id: string;
  visible: boolean;
  client: GadgetEntity;
  organization: GadgetEntity;
};

export type GadgetHeaderProps = {
  userName: string;
  organizationName: string;
  socketOn: boolean;
  messagesCount: number;
  onMonitorClick: () => void;
  onNotificationClick: () => void;
};

export enum GadgetProgressStatus {
  Idle,
  Active,
  Done,
}

export type GadgetProgressProps = {
  id: string;
  progress: number;
  status: GadgetProgressStatus;
};

export type GadgetProgressGridProps = {
  gadgetProgressProps: GadgetProgressProps[];
};

export type GadgetContentSliderProps = {
  notifications: ReactElement<typeof GadgetNotifications>;
  progress: ReactElement<typeof GadgetProgressGrid>;
  contentToggled: boolean;
};

export type GadgetNotificationsProps = {
  notifications: GatewayNotification[];
};
