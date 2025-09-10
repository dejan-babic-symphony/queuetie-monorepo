import { useCallback } from 'react';
import { useGadgetState } from './useGadgetState';

export const useGadgetAnimations = () => {
  const { gadgets, clearGadgets, updateGadget } = useGadgetState();

  const clearGadgetsAnimated = useCallback(() => {
    const staggerDelay = 100;
    const animationDuration = 500;

    gadgets.forEach((gadget, index) => {
      setTimeout(() => {
        updateGadget(gadget.id, { isVisible: false });
      }, index * staggerDelay);
    });

    const totalDelay = (gadgets.length - 1) * staggerDelay + animationDuration;
    setTimeout(() => clearGadgets(), totalDelay);
  }, [gadgets, clearGadgets, updateGadget]);

  const removeGadgetAnimated = useCallback(
    (gadgetId: string, removeCallback: () => void) => {
      const animationDuration = 500;

      updateGadget(gadgetId, { isVisible: false });

      setTimeout(() => removeCallback(), animationDuration);
    },
    [updateGadget]
  );

  return {
    clearGadgetsAnimated,
    removeGadgetAnimated,
  };
};
