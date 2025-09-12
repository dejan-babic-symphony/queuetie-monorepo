import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export enum ProgressStatus {
  Idle = 'idle',
  Reserved = 'reserved',
  Active = 'active',
  Done = 'done',
}

export type ProgressControl = {
  readonly id: string;
  readonly progress: number;
  readonly status: ProgressStatus;
};

type ProgressControls = Record<string, ProgressControl>;

export type ProgressControlApi = {
  readonly controls: ProgressControls;
  readonly available: readonly string[];
  readonly register: (id?: string) => string;
  readonly update: (id: string, progress: number) => boolean;
  readonly reserve: (id: string) => boolean;
  readonly remove: (id: string) => boolean;
  readonly reset: (id: string) => boolean;
  readonly clear: () => void;
};
const progressToStatus = (progress: number): ProgressStatus => {
  if (progress === 100) return ProgressStatus.Done;
  return ProgressStatus.Active; // progress is always > 0 when called from update
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export function useProgressControl(): ProgressControlApi {
  const [controls, setControls] = useState<ProgressControls>({});

  const register = useCallback(
    (id?: string): string => {
      const newId = id ?? uuidv4();
      const exists = newId in controls;

      // Prevent duplicate registration
      if (exists) {
        return newId;
      }

      setControls((previous) => ({
        ...previous,
        [newId]: {
          id: newId,
          progress: 0,
          status: ProgressStatus.Idle,
        },
      }));

      return newId;
    },
    [controls]
  );

  const update = useCallback(
    (id: string, progress: number): boolean => {
      const clampedProgress = clamp(progress, 0, 100);
      const exists = id in controls;

      if (!exists) return false;

      const control = controls[id];

      // Only allow updates on reserved controls (Reserved, Active, or Done)
      if (control.status === ProgressStatus.Idle) return false;

      const status = progress < 0 ? ProgressStatus.Idle : progressToStatus(clampedProgress);

      // Avoid unnecessary updates
      if (control.progress === clampedProgress && control.status === status) {
        return false;
      }

      setControls((previous) => ({
        ...previous,
        [id]: { ...control, progress: clampedProgress, status },
      }));

      return true;
    },
    [controls]
  );

  const reserve = useCallback(
    (id: string): boolean => {
      const exists = id in controls;

      if (!exists) return false;

      const control = controls[id];

      if (control.status === ProgressStatus.Active || control.status === ProgressStatus.Reserved)
        return false;

      setControls((previous) => ({
        ...previous,
        [id]: {
          ...control,
          progress: 0,
          status: ProgressStatus.Reserved,
        },
      }));

      return true;
    },
    [controls]
  );

  const remove = useCallback(
    (id: string): boolean => {
      const exists = id in controls;

      if (exists) {
        setControls((previous) => {
          const updated = { ...previous };
          delete updated[id];
          return updated;
        });
      }

      return exists;
    },
    [controls]
  );

  const reset = useCallback(
    (id: string): boolean => {
      const exists = id in controls;

      if (!exists) return false;

      const control = controls[id];

      setControls((previous) => ({
        ...previous,
        [id]: {
          ...control,
          progress: 0,
          status: ProgressStatus.Idle,
        },
      }));

      return true;
    },
    [controls]
  );

  const clear = useCallback(() => {
    setControls({});
  }, []);

  const available = useMemo(() => {
    return Object.values(controls || {})
      .filter((control) => control.status === ProgressStatus.Idle)
      .map((control) => control.id) as readonly string[];
  }, [controls]);

  return {
    controls,
    available,
    register,
    update,
    reserve,
    remove,
    reset,
    clear,
  };
}
