import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { ProgressControl } from '../../hooks/useProgressControl';
import { useGadgetInstance } from '../../providers';
import { GadgetProgress } from './GadgetProgress';

export const GadgetProgressGrid: React.FC = () => {
  const { progressControls } = useGadgetInstance();

  const controlsList = Object.values(progressControls);

  useEffect(() => {}, [progressControls]);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ alignItems: 'center ', justifyContent: 'center', my: 4 }}
    >
      {controlsList.map((control: ProgressControl) => {
        return <GadgetProgress key={control.id} {...control} />;
      })}
    </Stack>
  );
};
