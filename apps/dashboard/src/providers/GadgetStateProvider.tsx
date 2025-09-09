import React, { useCallback, useState } from 'react';
import { GadgetProps } from '../components/Gadget/types';
import { GadgetStateProviderProps } from './types';
import { createGadget, autoUngroupIfNeeded } from './utils';
import { GadgetStateContext } from './GadgetStateContext';

const useGadgets = () => {
  const [gadgets, setGadgets] = useState<GadgetProps[]>([]);

  const hasGadgets = gadgets.length > 0;

  const updateGadget = useCallback((targetId: string, update: Partial<GadgetProps>) => {
    setGadgets((previousGadgets) => {
      return previousGadgets.map((gadget) => {
        if (gadget.id === targetId) {
          return { ...gadget, ...update };
        }
        return gadget;
      });
    });
  }, []);

  const addGadget = useCallback(() => {
    setGadgets((previousGadgets) => {
      const newGadget: GadgetProps = createGadget();
      return [...previousGadgets, newGadget];
    });
  }, []);

  const clearGadgets = useCallback(() => {
    setGadgets([]);
  }, []);

  // Separate action functions
  const removeGadget = useCallback((id: string) => {
    setGadgets((currentGadgets) => {
      const gadgetToRemove = currentGadgets.find((g) => g.id === id);
      if (!gadgetToRemove) return currentGadgets;

      const filteredGadgets = currentGadgets.filter((gadget) => gadget.id !== id);
      return autoUngroupIfNeeded(filteredGadgets, gadgetToRemove.organization.id);
    });
  }, []);

  const groupGadget = useCallback((id: string) => {
    setGadgets((previousGadgets) => {
      const gadgetToGroup = previousGadgets.find((g) => g.id === id);
      if (!gadgetToGroup) return previousGadgets;

      const newGadget: GadgetProps = createGadget({
        organization: gadgetToGroup.organization,
        isGroup: true,
      });

      // Update the original gadget and add the new one in a single state update
      return [
        ...previousGadgets.map((gadget) =>
          gadget.id === id ? { ...gadget, isGroup: true } : gadget
        ),
        newGadget,
      ];
    });
  }, []);

  const leaveGroup = useCallback((id: string) => {
    setGadgets((currentGadgets) => {
      const gadgetToUpdate = currentGadgets.find((g) => g.id === id);
      if (!gadgetToUpdate) return currentGadgets;

      const originalOrgId = gadgetToUpdate.organization.id;
      const { organization: newOrganization } = createGadget();

      const updatedGadgets = currentGadgets.map((gadget) => {
        if (gadget.id === id) {
          return { ...gadget, organization: newOrganization, isGroup: false };
        }
        return gadget;
      });

      return autoUngroupIfNeeded(updatedGadgets, originalOrgId);
    });
  }, []);

  return {
    gadgets,
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
