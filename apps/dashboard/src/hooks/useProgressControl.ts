import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export enum ProgressStatus {
  Idle,
  Active,
  Done,
}

export type ProgressControl = {
  id: string;
  progress: number;
  status: ProgressStatus;
};

const progressToStatus: Record<number, ProgressStatus> = {
  0: ProgressStatus.Idle,
  100: ProgressStatus.Done,
};

export function useProgressControl() {
  const [controls, setControls] = useState<Record<string, ProgressControl>>({});

  useEffect(() => {
    const controlsList = Object.values(controls);
    const d = controlsList.map((c) => c.status);
    if ((d[0] ?? 4) == 0) console.log('idle');
    if ((d[0] ?? 4) == 1) console.log('active');
    if ((d[0] ?? 4) == 2) console.log('done');
  }, [controls]);

  const register = useCallback((id?: string) => {
    const newId = id ?? uuidv4();

    setControls((previous) => ({
      ...previous,
      [newId]: {
        id: newId,
        progress: 0,
        status: ProgressStatus.Idle,
      },
    }));
  }, []);

  const update = useCallback((id: string, progress: number) => {
    setControls((previous) => {
      const control = previous[id];

      if (!control) return previous;

      const status = progressToStatus[progress] ?? ProgressStatus.Active;

      console.log(progress);

      return {
        ...previous,
        [id]: { ...control, progress, status },
      };
    });
  }, []);

  const reserve = useCallback((id: string) => {
    setControls((previous) => {
      const control = previous[id];

      if (!control) return previous;

      return {
        ...previous,
        [id]: {
          ...control,
          progress: 0,
          status: ProgressStatus.Active,
        },
      };
    });
  }, []);

  const available = useMemo(() => {
    return Object.values(controls)
      .filter((control) => control.status !== ProgressStatus.Active)
      .map((control) => control.id);
  }, [controls]);

  return { controls, register, update, reserve, available };
}
