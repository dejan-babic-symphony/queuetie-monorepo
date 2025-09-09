import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Box, IconButton } from '@mui/material';
import { FC } from 'react';
import { useGadgetInstance } from '../../providers';
export const GadgetGroupActions: FC = () => {
  const gadget = useGadgetInstance();

  return (
    <Box>
      <IconButton
        aria-label={`Add Gadget to ${gadget.organization.name}`}
        title={`Add Gadget to ${gadget.organization.name}`}
        onClick={gadget.handleGroupAdd}
      >
        <GroupAddIcon />
      </IconButton>
      <IconButton
        aria-label={`Leave ${gadget.organization.name}`}
        title={`Leave ${gadget.organization.name}`}
        onClick={gadget.handleGroupLeave}
        disabled={!gadget.isGroup}
      >
        <ExitToAppIcon />
      </IconButton>
    </Box>
  );
};
