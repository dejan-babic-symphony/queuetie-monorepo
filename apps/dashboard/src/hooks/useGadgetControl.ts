import { useRef } from 'react';
import { GadgetProgressStatus, GadgetProgressProps } from '../components/Gadget/types';
import { useGadgetProgress } from './useGadgetProgress';

type ReferenceMap = { [key: string]: (progress: number) => void };
type StateReferenceMap = { [key: string]: GadgetProgressStatus };

export const useGadgetControl = () => {
  const reference = useRef<ReferenceMap>({});
  const stateReference = useRef<StateReferenceMap>({});

  const register = (): GadgetProgressProps & { id: string } => {
    const { id, props, updateProgress } = useGadgetProgress();

    reference.current[id] = updateProgress;
    stateReference.current[id] = props.status;

    return { id, ...props };
  };

  const associate = (id: string, ref: string): void => {
    reference.current[ref] = reference.current[id] ?? (() => {});
  };

  const update = (id: string, progress: number): void => {
    reference.current[id]?.(progress);
  };

  const statuses = stateReference.current;

  const available = Object.keys(statuses).filter(
    (key) => statuses[key] === GadgetProgressStatus.Idle
  );

  return { register, update, associate, available };
};
