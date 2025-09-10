import { useCallback, useContext } from 'react';
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
  const { removeGadget, groupGadget, leaveGroup, updateGadget, gadgets } = useGadgetState();

  // Memoized action creators to prevent unnecessary re-renders
  const handleRemoveGadget = useCallback(() => {
    removeGadget(gadgetId);
  }, [gadgetId, removeGadget]);

  const handleGroupGadget = useCallback(() => {
    groupGadget(gadgetId);
  }, [gadgetId, groupGadget]);

  const handleLeaveGroup = useCallback(() => {
    leaveGroup(gadgetId);
  }, [gadgetId, leaveGroup]);

  const handleUpdateGadget = useCallback(
    (updates: Parameters<typeof updateGadget>[1]) => {
      updateGadget(gadgetId, updates);
    },
    [gadgetId, updateGadget]
  );

  const toggleVisibility = useCallback(() => {
    const gadget = gadgets.find((gadget) => gadget.id === gadgetId);
    if (gadget) {
      updateGadget(gadgetId, { isVisible: !gadget.isVisible });
    }
  }, [gadgetId, updateGadget, gadgets]);

  return {
    removeGadget: handleRemoveGadget,
    groupGadget: handleGroupGadget,
    leaveGroup: handleLeaveGroup,
    updateGadget: handleUpdateGadget,
    toggleVisibility,
  };
};
