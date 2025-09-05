import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import React from 'react';
import { ProgressControl, ProgressStatus } from '../../hooks/useProgressControl';

export const GadgetProgress: React.FC<ProgressControl> = ({ progress, status }) => {
  const isIdle = status === ProgressStatus.Idle;
  const calculatedProgress = Math.round(isIdle ? 100 : Math.max(Math.min(progress, 100), 0));
  const displayProgress = isIdle ? '0%' : `${calculatedProgress}%`;

  const statusToColorMap: Map<ProgressStatus, 'primary.main' | 'success.main' | '#BDBDBD'> =
    new Map([
      [ProgressStatus.Idle, '#BDBDBD'],
      [ProgressStatus.Active, 'primary.main'],
      [ProgressStatus.Done, 'success.main'],
    ]);

  return (
    <Paper sx={{ p: 3, pt: 4 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
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
