import { Box, Typography } from '@mui/material';
import { DiceBearAvatar } from '../DiceBear';

export const EmptyDashboard: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      textAlign="center"
      color={'text.secondary'}
      gap={2}
    >
      <DiceBearAvatar seed={'Queuetie'} size={48}></DiceBearAvatar>
      <Typography variant="h6">No gadgets yet</Typography>
      <Typography variant="body2">
        Get started by adding a gadget using the <b>➕</b> button.
      </Typography>
    </Box>
  );
};
