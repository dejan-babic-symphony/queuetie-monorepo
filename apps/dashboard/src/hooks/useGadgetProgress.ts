import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GadgetProgressStatus, GadgetProgressProps } from '../components/Gadget/types';

export const useGadgetProgress = () => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<GadgetProgressStatus>(GadgetProgressStatus.Idle);

  const id = useRef(uuidv4()).current;

  const props: GadgetProgressProps = {
    id,
    progress,
    status,
  };

  const updateProgress = (progress: number) => {
    switch (progress) {
      case 0:
        setStatus(GadgetProgressStatus.Idle);
        break;
      case 100:
        setStatus(GadgetProgressStatus.Done);
        setTimeout(() => {
          setStatus(GadgetProgressStatus.Idle);
        }, 2000);
        break;
      default:
        setStatus(GadgetProgressStatus.Active);
    }

    setProgress(progress);
  };

  return { id, props, updateProgress };
};
