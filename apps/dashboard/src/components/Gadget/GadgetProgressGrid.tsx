import { Stack } from '@mui/material';
import { GadgetProgress } from './GadgetProgress';
import { GadgetProgressGridProps } from './types';

export const GadgetProgressGrid: React.FC<GadgetProgressGridProps> = ({ gadgetProgressProps }) => {
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
