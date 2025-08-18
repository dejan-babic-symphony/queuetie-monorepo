import { Stack } from '@mui/material';
import { useContext } from 'react';
import { GadgetContext } from '../../providers/GadgetContext';
import { GadgetProgress } from './GadgetProgress';

export const GadgetProgressGrid: React.FC = () => {
  const { gadgetProgressProps } = useContext(GadgetContext);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ alignItems: 'center ', justifyContent: 'center', my: 4 }}
    >
      {gadgetProgressProps.map((props) => {
        return <GadgetProgress key={props.id} {...props} />;
      })}
    </Stack>
  );
};
