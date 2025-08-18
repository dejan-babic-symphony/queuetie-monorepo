import CampaignIcon from '@mui/icons-material/Campaign';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MessageIcon from '@mui/icons-material/Message';
import { Box, IconButton } from '@mui/material';
import { FC, useContext } from 'react';
import { GadgetContext } from '../../providers/GadgetContext';

export const GadgetNotificationActions: FC = () => {
  const gadget = useContext(GadgetContext);
  return (
    <Box>
      <IconButton
        aria-label={`Broadcast to ${gadget.organization.name}`}
        title={`Broadcast to ${gadget.organization.name}`}
        onClick={gadget.handleGroupBroadcast}
        disabled={!gadget.isGroup}
      >
        <CampaignIcon />
      </IconButton>
      <IconButton
        aria-label="Broadcast to member"
        title="Broadcast to member"
        onClick={gadget.handleGroupBroadcast}
        disabled={!gadget.isGroup}
      >
        <MessageIcon />
      </IconButton>

      <IconButton
        aria-label="Clear notifications"
        title="Clear notifications"
        onClick={gadget.handleClearNotifications}
        disabled={gadget.notifications.length == 0}
      >
        <MarkChatReadIcon />
      </IconButton>
    </Box>
  );
};
