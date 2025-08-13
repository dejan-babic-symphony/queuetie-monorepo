import { Box, Typography } from '@mui/material';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import { EmptyDashboardProps } from './types';

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ show = true }) => {
  return (
    show && (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        color="gray"
        textAlign="center"
        gap={2}
      >
        <RocketLaunch fontSize="large" color="primary" />
        <Typography variant="h6">No gadgets yet</Typography>
        <Typography variant="body2">
          Get started by adding a gadget using the <b>➕</b> button.
        </Typography>
      </Box>
    )
  );
};
