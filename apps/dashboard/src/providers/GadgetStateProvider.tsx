import React, { useCallback, useState } from 'react';
import { GadgetProps } from '../components/Gadget/types';
import { GadgetStateProviderProps } from './types';
import { createGadget, autoUngroupIfNeeded } from './utils';
import { GadgetStateContext } from './GadgetStateContext';

const useGadgets = () => {
  const [gadgets, setGadgets] = useState<GadgetProps[]>([]);

  const hasGadgets = (gadgets || []).length > 0;

  const updateGadget = useCallback((targetId: string, update: Partial<GadgetProps>) => {
    setGadgets((previousGadgets) => {
      const safeGadgets = previousGadgets || [];
      return safeGadgets.map((gadget) => {
        if (gadget.id === targetId) {
          return { ...gadget, ...update };
        }
        return gadget;
      });
    });
  }, []);

  const addGadget = useCallback(() => {
    setGadgets((previousGadgets) => {
      const safeGadgets = previousGadgets || [];
      const newGadget: GadgetProps = createGadget();
      return [...safeGadgets, newGadget];
    });
  }, []);

  const clearGadgets = useCallback(() => {
    setGadgets([]);
  }, []);

  // Separate action functions
  const removeGadget = useCallback((id: string) => {
    setGadgets((currentGadgets) => {
      const safeGadgets = currentGadgets || [];
      const gadgetToRemove = safeGadgets.find((g) => g.id === id);
      if (!gadgetToRemove) return safeGadgets;

      const filteredGadgets = safeGadgets.filter((gadget) => gadget.id !== id);
      return autoUngroupIfNeeded(filteredGadgets, gadgetToRemove.organization.id);
    });
  }, []);

  const groupGadget = useCallback((id: string) => {
    setGadgets((previousGadgets) => {
      const safeGadgets = previousGadgets || [];
      const gadgetToGroup = safeGadgets.find((g) => g.id === id);
      if (!gadgetToGroup) return safeGadgets;

      const newGadget: GadgetProps = createGadget({
        organization: gadgetToGroup.organization,
        isGroup: true,
      });

      // Update the original gadget and add the new one in a single state update
      return [
        ...safeGadgets.map((gadget) => (gadget.id === id ? { ...gadget, isGroup: true } : gadget)),
        newGadget,
      ];
    });
  }, []);

  const leaveGroup = useCallback((id: string) => {
    setGadgets((currentGadgets) => {
      const safeGadgets = currentGadgets || [];
      const gadgetToUpdate = safeGadgets.find((g) => g.id === id);
      if (!gadgetToUpdate) return safeGadgets;

      const originalOrgId = gadgetToUpdate.organization.id;
      const { organization: newOrganization } = createGadget();

      const updatedGadgets = safeGadgets.map((gadget) => {
        if (gadget.id === id) {
          return { ...gadget, organization: newOrganization, isGroup: false };
        }
        return gadget;
      });

      return autoUngroupIfNeeded(updatedGadgets, originalOrgId);
    });
  }, []);

  return {
    gadgets: gadgets || [],
    hasGadgets,
    addGadget,
    clearGadgets,
    setGadgets,
    updateGadget,
    createGadget,
    removeGadget,
    groupGadget,
    leaveGroup,
  };
};

export const GadgetStateProvider: React.FC<GadgetStateProviderProps> = ({ children }) => {
  const gadgetState = useGadgets();

  return <GadgetStateContext.Provider value={gadgetState}>{children}</GadgetStateContext.Provider>;
};
