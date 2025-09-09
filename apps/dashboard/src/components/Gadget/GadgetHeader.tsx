import MonitorIcon from '@mui/icons-material/Monitor';
import NotificationIcon from '@mui/icons-material/Notifications';
import { Badge, Box, CardHeader, IconButton } from '@mui/material';
import React from 'react';
import { useGadgetInstance } from '../../providers';
import { DiceBearAvatar } from '../DiceBear';
import { DiceBearVariant } from '../DiceBear/types';

export const GadgetHeader: React.FC = () => {
  const { socketOn, client, organization, handleContentToggle, notifications } =
    useGadgetInstance();

  return (
    <CardHeader
      avatar={
        <Badge
          variant="dot"
          color={socketOn ? 'success' : 'error'}
          anchorOrigin={{
            horizontal: 'left',
          }}
        >
          <DiceBearAvatar seed={client.name} />
        </Badge>
      }
      title={client.name}
      subheader={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {organization.name}
          <DiceBearAvatar seed={organization.name} size={12} variant={DiceBearVariant.IDENTICON} />
        </Box>
      }
      action={
        <>
          <IconButton
            aria-label="Job progress monitor"
            onClick={handleContentToggle}
            title="Show job progress monitor"
          >
            <Badge>
              <MonitorIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-label="Notifications"
            onClick={handleContentToggle}
            title="Show notifications"
          >
            <Badge badgeContent={notifications.length} max={99} color="primary">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </>
      }
    />
  );
};
