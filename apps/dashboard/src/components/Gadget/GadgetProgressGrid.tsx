import { Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { ProgressControl } from '../../hooks/useProgressControl';
import { useGadgetInstance } from '../../providers';
import { GadgetProgress } from './GadgetProgress';

export const GadgetProgressGrid: React.FC = () => {
  const { progressControls } = useGadgetInstance();

  const controlsList = Object.values(progressControls || {});
  const hasProgress = controlsList.length > 0;

  useEffect(() => {}, [progressControls]);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ alignItems: 'center ', justifyContent: 'center', my: 4 }}
    >
      {!hasProgress && <Typography variant="caption">No registered progress controls</Typography>}

      {controlsList.map((control: ProgressControl) => {
        return <GadgetProgress key={control.id} {...control} />;
      })}
    </Stack>
  );
};
