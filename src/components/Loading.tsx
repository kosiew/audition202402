import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
