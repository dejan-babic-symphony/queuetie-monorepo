import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { GadgetSpeedDialProps } from './types';

export const GadgetSpeedDial: React.FC<GadgetSpeedDialProps> = ({
  showClearButton,
  onAddGadget,
  onClearGadgets,
}) => {
  const ariaLabel = 'Speed dial for gadget control';
  const sx = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000,
  };

  return (
    <>
      <SpeedDial ariaLabel={ariaLabel} sx={sx} icon={<SpeedDialIcon />}>
        <SpeedDialAction
          key={'add'}
          icon={<PersonAddIcon />}
          title="Add Gadget"
          onClick={onAddGadget}
        />
        {showClearButton && (
          <SpeedDialAction
            key={'clear'}
            icon={<DeleteSweepIcon />}
            title="Clear Gadgets"
            onClick={onClearGadgets}
          />
        )}
      </SpeedDial>
    </>
  );
};
