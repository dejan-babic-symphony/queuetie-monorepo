import { ReactElement } from 'react';
import { GadgetNotifications } from './GadgetNotifications';
import { GadgetProgressGrid } from './GadgetProgressGrid';
import { ProgressControl } from '../../hooks/useProgressControl';

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
  isVisible: boolean;
  isGroup: boolean;
  client: GadgetEntity;
  organization: GadgetEntity;
  onGroup: () => void;
  onGroupLeave: () => void;
  onRemove: () => void;
};

export enum GadgetProgressStatus {
  Idle,
  Active,
  Done,
}

export type GadgetProgressProps = ProgressControl;

export type GadgetContentSliderProps = {
  notifications: ReactElement<typeof GadgetNotifications>;
  progress: ReactElement<typeof GadgetProgressGrid>;
};
