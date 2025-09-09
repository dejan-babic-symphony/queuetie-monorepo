import { ReactNode } from 'react';
import { GadgetProps } from '../components/Gadget/types';

export type GadgetStateContextType = {
  gadgets: GadgetProps[];
  hasGadgets: boolean;
  addGadget: () => void;
  clearGadgets: () => void;
  setGadgets: (gadgets: GadgetProps[]) => void;
  removeGadget: (id: string) => void;
  groupGadget: (id: string) => void;
  leaveGroup: (id: string) => void;
  updateGadget: (id: string, update: Partial<GadgetProps>) => void;
  createGadget: (override?: Partial<GadgetProps>) => GadgetProps;
};

export type GadgetStateProviderProps = {
  children: ReactNode;
};
