import { createContext } from 'react';
import { GadgetStateContextType } from './types';

export const GadgetStateContext = createContext<GadgetStateContextType | null>(null);
