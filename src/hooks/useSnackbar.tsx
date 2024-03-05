import { Alert, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback(
    (event?: React.SyntheticEvent<any> | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    },
    []
  );

  const SnackbarComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );

  return {
    showSnackbar,
    SnackbarComponent,
  };
}
