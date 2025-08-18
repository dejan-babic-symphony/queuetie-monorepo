import MonitorIcon from '@mui/icons-material/Monitor';
import NotificationIcon from '@mui/icons-material/Notifications';
import { Badge, Box, CardHeader, IconButton } from '@mui/material';
import React from 'react';
import { DiceBearAvatar } from '../DiceBear';
import { DiceBearVariant } from '../DiceBear/types';
import { GadgetHeaderProps } from './types';

export const GadgetHeader: React.FC<GadgetHeaderProps> = ({
  userName,
  organizationName,
  socketOn,
  messagesCount,
  onMonitorClick,
  onNotificationClick,
}) => {
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
          <DiceBearAvatar seed={userName} />
        </Badge>
      }
      title={userName}
      subheader={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {organizationName}
          <DiceBearAvatar seed={organizationName} size={12} variant={DiceBearVariant.IDENTICON} />
        </Box>
      }
      action={
        <>
          <IconButton
            aria-label="Job progress monitor"
            onClick={onMonitorClick}
            title="Show job progress monitor"
          >
            <Badge>
              <MonitorIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-label="Notifications"
            onClick={onNotificationClick}
            title="Show notifications"
          >
            <Badge badgeContent={messagesCount} max={99} color="primary">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </>
      }
    />
  );
};
