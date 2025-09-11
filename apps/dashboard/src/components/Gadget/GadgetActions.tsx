import DeleteIcon from '@mui/icons-material/Delete';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { Box, Divider, IconButton } from '@mui/material';
import { FC } from 'react';
import { useGadgetInstance } from '../../providers';
import { GadgetGroupActions } from './GadgetGroupActions';
import { GadgetJobActions } from './GadgetJobActions';
import { GadgetNotificationActions } from './GadgetNotificationActions';

export const GadgetActions: FC = () => {
  const { socketOn, activeContent, handleToggleSocket, handleRemove } = useGadgetInstance();

  const renderContentActions = () => {
    switch (activeContent) {
      case 'progress':
        return <GadgetJobActions />;
      case 'notifications':
        return <GadgetNotificationActions />;
      case 'none':
      default:
        return null;
    }
  };

  return (
    <>
      <IconButton
        aria-label="Toggle socket connection"
        title="Toggle the socket connection"
        onClick={handleToggleSocket}
      >
        {socketOn ? <PowerIcon color="success" /> : <PowerOffIcon color="disabled" />}
      </IconButton>
      <Divider variant="middle" orientation="vertical" flexItem />
      {renderContentActions()}
      <Divider variant="middle" orientation="vertical" flexItem />
      <GadgetGroupActions />
      <Box sx={{ flexGrow: 1 }} />
      <IconButton aria-label={`Remove Gadget`} title={`Remove Gadget`} onClick={handleRemove}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};
