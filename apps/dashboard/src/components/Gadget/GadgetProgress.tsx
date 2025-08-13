import React from 'react';
import { GadgetProgressProps, GadgetProgressStatus } from './types';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';

export const GadgetProgress: React.FC<GadgetProgressProps> = ({ progress, status }) => {
  const isIdle = status === GadgetProgressStatus.Idle;
  const calculatedProgress = Math.round(isIdle ? 100 : Math.max(Math.min(progress, 100), 0));
  const displayProgress = isIdle ? '0%' : `${calculatedProgress}%`;

  const statusToColorMap: Map<GadgetProgressStatus, 'primary.main' | 'success.main' | '#BDBDBD'> =
    new Map([
      [GadgetProgressStatus.Idle, '#BDBDBD'],
      [GadgetProgressStatus.Active, 'primary.main'],
      [GadgetProgressStatus.Done, 'success.main'],
    ]);

  return (
    <Paper sx={{ p: 3, pt: 4 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          border: 'InfoBackground',
          alignContent: 'center',
        }}
      >
        <CircularProgress
          key={progress === 0 ? 'reset' : 'default'}
          variant={'determinate'}
          value={calculatedProgress}
          sx={{
            color: statusToColorMap.get(status),
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{`${displayProgress}`}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
