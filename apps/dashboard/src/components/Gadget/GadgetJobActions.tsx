import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import SettingsIcon from '@mui/icons-material/Settings';
import SyncIcon from '@mui/icons-material/Sync';
import { Box, IconButton } from '@mui/material';
import { FC } from 'react';
import { useGadgetInstance } from '../../providers';
export const GadgetJobActions: FC = () => {
  const gadget = useGadgetInstance();

  return (
    <Box>
      <IconButton
        aria-label="Dispatch jobs"
        title="Dispatch jobs"
        onClick={gadget.handleSimulateDispatch}
        disabled={!gadget.dispatchEnabled}
      >
        <AddToQueueIcon />
      </IconButton>
      <IconButton
        aria-label="Sync job progress"
        title="Sync job progress"
        onClick={gadget.handleSimulateDispatch}
      >
        <SyncIcon />
      </IconButton>
      <IconButton aria-label="Configure jobs" title="Configure jobs">
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};
