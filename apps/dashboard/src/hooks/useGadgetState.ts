import { useContext } from 'react';
import { GadgetStateContext } from '../providers/GadgetStateContext';
import { GadgetStateContextType } from '../providers/types';

export const useGadgetState = (): GadgetStateContextType => {
  const context = useContext(GadgetStateContext);
  if (!context) {
    throw new Error('useGadgetState must be used within a GadgetStateProvider');
  }
  return context;
};
export const useGadgetActions = (gadgetId: string) => {
  const { removeGadget, groupGadget, leaveGroup } = useGadgetState();

  return {
    onRemove: () => removeGadget(gadgetId),
    onGroup: () => groupGadget(gadgetId),
    onGroupLeave: () => leaveGroup(gadgetId),
  };
};
