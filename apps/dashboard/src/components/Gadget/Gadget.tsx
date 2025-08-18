import { faker } from '@faker-js/faker';
import { Card, CardActions, CardContent } from '@mui/material';
import {
  GatewayBroadcast,
  GatewayNotification,
  GatewayProgress,
  SimulateRequestType,
} from '@queuetie/types';
import { UUID } from 'crypto';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGadgetControl } from '../../hooks/useGadgetControl';
import { useSocket } from '../../hooks/useSocket';
import { GadgetProvider } from '../../providers/GadgetProvider';
import { useBroadcastMutation, useDispatchSimulateMutation } from '../../queries/dispatcher';
import { GadgetActions } from './GadgetActions';
import { GadgetContentSlider } from './GadgetContentSlider';
import { GadgetHeader } from './GadgetHeader';
import { GadgetNotifications } from './GadgetNotifications';
import { GadgetProgressGrid } from './GadgetProgressGrid';
import { GadgetProps } from './types';
export const Gadget: React.FC<GadgetProps> = ({
  client,
  organization,
  isGroup,
  onGroup: handleGroupAdd,
  onGroupLeave: handleGroupLeave,
  onRemove: handleRemove,
}) => {
  const { socket } = useSocket(client, organization);
  const [socketOn, setSocketOn] = useState<boolean>(false);
  const [contentToggled, setContentToggled] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<GatewayNotification[]>([]);
  const { register, available, associate, update } = useGadgetControl();
  const { mutate: dispatchSimulate } = useDispatchSimulateMutation();
  const { mutate: broadcast } = useBroadcastMutation();

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

  const handleContentToggle = () => {
    setContentToggled((previous) => !previous);
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

  // Job dispatching handlers
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

  // Broadcasting handlers
  const handleGroupBroadcast = () => {
    const message = `${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()}`;
    const notification: GatewayNotification = {
      type: 'broadcast_organization',
      message,
      from: client.name,
      timestamp: new Date().toISOString(),
    };

    const broadcastPayload: GatewayBroadcast = {
      target: organization.id as UUID,
      scope: 'organization',
      notification,
    };

    broadcast({ socket, broadcast: broadcastPayload });
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
    <GadgetProvider
      value={{
        socketOn,
        isGroup,
        contentToggled,
        dispatchEnabled,
        client,
        organization,
        gadgetProgressProps,
        notifications,
        handleToggleSocket,
        handleContentToggle,
        handleSimulateDispatch,
        handleClearNotifications,
        handleGroupBroadcast,
        handleGroupAdd,
        handleGroupLeave,
        handleRemove,
      }}
    >
      <Card sx={{ width: 345, height: 345, margin: 2 }}>
        <GadgetHeader />
        <CardContent>
          <GadgetContentSlider
            progress={<GadgetProgressGrid />}
            notifications={<GadgetNotifications />}
          ></GadgetContentSlider>
        </CardContent>
        <CardActions disableSpacing>
          <GadgetActions />
        </CardActions>
      </Card>
    </GadgetProvider>
  );
};
