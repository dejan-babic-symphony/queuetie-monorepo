import { ReactElement } from 'react';
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
};

export enum GadgetProgressStatus {
  Idle,
  Active,
  Done,
}

export type GadgetProgressProps = ProgressControl;

export type GadgetContentType = 'progress' | 'notifications' | 'none';

export type GadgetContentSliderProps = {
  notifications: ReactElement;
  progress: ReactElement;
};
