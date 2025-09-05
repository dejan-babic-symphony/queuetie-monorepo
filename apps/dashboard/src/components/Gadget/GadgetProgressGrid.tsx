import { Stack } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ProgressControl } from '../../hooks/useProgressControl';
import { GadgetContext } from '../../providers/GadgetContext';
import { GadgetProgress } from './GadgetProgress';

export const GadgetProgressGrid: React.FC = () => {
  const { progressControls } = useContext(GadgetContext);

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
