import { useContext } from 'react';
import {
  GadgetInstanceContext,
  GadgetInstanceContextType,
} from '../providers/GadgetInstanceContext';

export const useGadgetInstance = (): GadgetInstanceContextType => {
  const context = useContext(GadgetInstanceContext);
  if (!context) {
    throw new Error('useGadgetInstance must be used within a GadgetProvider');
  }
  return context;
};
