import AddToQueueIcon from '@mui/icons-material/AddToQueueOutlined';
import CampaignIcon from '@mui/icons-material/Campaign';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import MessageIcon from '@mui/icons-material/MessageOutlined';
import PowerOffIcon from '@mui/icons-material/PowerOffOutlined';
import PowerIcon from '@mui/icons-material/PowerOutlined';
import { Alert, Box, SxProps, Typography } from '@mui/material';
import { GatewayNotificationType } from '@queuetie/types';
import { compareDesc, differenceInMinutes, format, formatDistanceToNow, parseISO } from 'date-fns';
import { FC, ReactNode } from 'react';
import { useGadgetInstance } from '../../providers';
export const GadgetNotifications: FC = () => {
  const { notifications } = useGadgetInstance();
  const hasNotifications = notifications.length > 0;

  const iconMap: Partial<Record<GatewayNotificationType, ReactNode>> = {
    socket_connect: <PowerIcon fontSize="medium" color="success" />,
    socket_disconnect: <PowerOffIcon fontSize="medium" color="error" />,
    jobs_dispatching: <AddToQueueIcon fontSize="medium" color="primary" />,
    jobs_completed: <CheckCircleOutlineIcon fontSize="medium" color="primary" />,
    broadcast_organization: <CampaignIcon fontSize="medium" color="primary" />,
    broadcast_client: <CampaignIcon fontSize="medium" color="primary" />,
    gadget_join: <GroupAddIcon fontSize="medium" color="primary" />,
    gadget_leave: <GroupRemoveIcon fontSize="medium" color="error" />,
  };

  const sortedNotifications = [...notifications].sort((a, b) =>
    compareDesc(parseISO(a.timestamp), parseISO(b.timestamp))
  );

  const containerSx: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: hasNotifications ? 'flex-start' : 'center',
    height: '100%',
    alignItems: 'center',
    gap: 1,
  };

  const alertSx: SxProps = {
    width: '100%',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    '&:hover': { backgroundColor: 'action.hover' },
  };

  const notificationSx: SxProps = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '240px',
  };

  const messageSx = {
    mr: 1,
  };

  const prettyTime = (timestamp: string) => {
    const date = parseISO(timestamp);
    return differenceInMinutes(new Date(), date) < 1
      ? format(date, 'HH:mm:ss')
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Box sx={containerSx}>
      {!hasNotifications && <Typography variant="caption">No notifications</Typography>}

      {sortedNotifications.map((notification, index) => (
        <Alert
          key={index}
          icon={iconMap[notification.type] ?? <MessageIcon fontSize="small" />}
          severity={notification.type === 'socket_disconnect' ? 'error' : 'info'}
          sx={alertSx}
        >
          <Box sx={notificationSx}>
            <Box>
              <Typography color="textPrimary" variant="body2" noWrap sx={messageSx}>
                {notification.from}
              </Typography>
              <Typography color="textSecondary" variant="caption" noWrap sx={messageSx}>
                {notification.message}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" noWrap>
              {prettyTime(notification.timestamp)}
            </Typography>
          </Box>
        </Alert>
      ))}
    </Box>
  );
};
