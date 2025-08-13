import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { Card, CardActions, CardContent, IconButton } from '@mui/material';
import { GatewayNotification, GatewayProgress, SimulateRequestType } from '@queuetie/types';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGadgetControl } from '../../hooks/useGadgetControl';
import { useSocket } from '../../hooks/useSocket';
import { useDispatchSimulateMutation } from '../../queries/dispatcher';
import { GadgetContentSlider } from './GadgetContentSlider';
import { GadgetHeader } from './GadgetHeader';
import { GadgetNotifications } from './GadgetNotifications';
import { GadgetProgressGrid } from './GadgetProgressGrid';
import { GadgetProps } from './types';

export const Gadget: React.FC<GadgetProps> = ({ client, organization }) => {
  const { socket } = useSocket(client, organization);
  const [socketOn, setSocketOn] = useState<boolean>(false);
  const [contentToggled, setContentToggled] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<GatewayNotification[]>([]);
  const { register, available, associate, update } = useGadgetControl();
  const { mutate: dispatchSimulate } = useDispatchSimulateMutation();

  // Derived values
  const dispatchEnabled = !!(available.length && socketOn);
  const gadgetProgressProps = Array.from({ length: 3 }).map(() => register());

  // Socket connection handlers
  const handleSocketConnect = useCallback(() => {
    setSocketOn(true);
  }, []);

  const handleSocketDisconnect = useCallback(() => {
    setSocketOn(false);
    setNotifications((previous) => [
      ...previous,
      {
        message: 'Socket disconnected',
        type: 'socket_disconnect',
        from: 'Queuetie',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleToggleSocket = () => {
    const action = socketOn ? 'disconnect' : 'connect';
    socket?.[action]();
  };

  // Socket notification handler
  const handleSocketNotification = (notification: GatewayNotification) => {
    setNotifications((previous) => [...previous, notification]);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Socket progress handler
  const handleSocketProgress = useCallback(
    (progress: GatewayProgress) => {
      const { dispatchedJobs, completed, context } = progress;
      update(context, (completed * 100) / dispatchedJobs);
    },
    [update]
  );

  //Job dispatching handlers
  const handleSimulateDispatch = () => {
    const id = available.reverse().slice(-1)[0];
    const context = uuidv4();

    associate(id, context);
    update(id, 0);

    const payload: SimulateRequestType = {
      type: 'single',
      queue: 'queuetie.first',
      delay: 10,
      echo: {
        total: Math.floor(Math.random() * 50) + 1,
        context,
        client,
        organization,
      },
    };
    dispatchSimulate(payload);
  };
  useEffect(() => {
    if (socket) {
      socket.on('connect', handleSocketConnect);
      socket.on('disconnect', handleSocketDisconnect);
      socket.on('queuetie.notification', handleSocketNotification);
      socket.on('queuetie.progress', handleSocketProgress);
    }

    return () => {
      if (socket) {
        socket.off('connect', handleSocketConnect);
        socket.off('disconnect', handleSocketDisconnect);
        socket.off('queuetie.notification', handleSocketNotification);
        socket.off('queuetie.progress', handleSocketProgress);
      }
    };
  }, [handleSocketConnect, handleSocketDisconnect, handleSocketProgress, socket]);

  return (
    <Card sx={{ width: 345, height: 345, margin: 2 }}>
      <GadgetHeader
        userName={client.name}
        organizationName={`@${organization.name}`}
        socketOn={socketOn}
        messagesCount={notifications.length}
        onMonitorClick={() => setContentToggled(true)}
        onNotificationClick={() => setContentToggled(false)}
      />

      <CardContent>
        <GadgetContentSlider
          progress={<GadgetProgressGrid gadgetProgressProps={gadgetProgressProps} />}
          notifications={<GadgetNotifications notifications={notifications} />}
          contentToggled={contentToggled}
        ></GadgetContentSlider>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="Toggle socket connection"
          title="Toggle the socket connection"
          onClick={handleToggleSocket}
        >
          {socketOn ? <PowerIcon color="success" /> : <PowerOffIcon color="disabled" />}
        </IconButton>
        <IconButton
          aria-label="Dispatch jobs"
          title="Dispatch jobs"
          onClick={handleSimulateDispatch}
          disabled={!dispatchEnabled}
        >
          <AddToQueueIcon />
        </IconButton>
        {!contentToggled && (
          <IconButton
            aria-label="Clear notifications"
            title="Clear notifications"
            onClick={handleClearNotifications}
            disabled={notifications.length === 0}
          >
            <MarkChatReadIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
