import MonitorIcon from '@mui/icons-material/Monitor';
import NotificationIcon from '@mui/icons-material/Notifications';
import { Badge, Box, CardHeader, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useGadgetInstance } from '../../providers';
import { DiceBearAvatar } from '../DiceBear';
import { DiceBearVariant } from '../DiceBear/types';

const titleSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '190px',
} as const;

const subheaderContainerSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
} as const;

const organizationNameSx = {
  flexShrink: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '160px',
} as const;

const actionContainerSx = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  marginTop: '-4px', // Fine-tune vertical position
} as const;

const cardHeaderSx = {
  '& .MuiCardHeader-action': {
    alignSelf: 'center',
    marginTop: 0,
  },
};

export const GadgetHeader: React.FC = () => {
  const {
    socketOn,
    client,
    organization,
    activeContent,
    handleShowProgress,
    handleShowNotifications,
    notifications,
  } = useGadgetInstance();

  return (
    <CardHeader
      sx={cardHeaderSx}
      avatar={
        <Badge
          variant="dot"
          color={socketOn ? 'success' : 'error'}
          anchorOrigin={{
            horizontal: 'left',
          }}
        >
          <DiceBearAvatar seed={client?.name || 'default'} />
        </Badge>
      }
      title={
        <Typography variant="body1" noWrap title={client?.name || ''} sx={titleSx}>
          {client?.name || 'Unknown Client'}
        </Typography>
      }
      subheader={
        <Box sx={subheaderContainerSx}>
          <Typography
            variant="caption"
            noWrap
            title={organization?.name || ''}
            sx={organizationNameSx}
          >
            {organization?.name || 'Unknown Organization'}
          </Typography>
          <DiceBearAvatar
            seed={organization?.name || 'default'}
            size={12}
            variant={DiceBearVariant.IDENTICON}
          />
        </Box>
      }
      action={
        <Box sx={actionContainerSx}>
          <IconButton
            aria-label="Job progress monitor"
            onClick={handleShowProgress}
            title="Show job progress monitor"
            color={activeContent === 'progress' ? 'primary' : 'default'}
          >
            <Badge>
              <MonitorIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-label="Notifications"
            onClick={handleShowNotifications}
            title="Show notifications"
            color={activeContent === 'notifications' ? 'primary' : 'default'}
          >
            <Badge badgeContent={notifications.length} max={99} color="primary">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </Box>
      }
    />
  );
};
