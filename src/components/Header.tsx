import UserInformation from '@/components/UserInformation';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { Session } from 'next-auth';
import React from 'react';

type Props = {
  session: Session | null;
  refreshing: boolean;
};

const Header: React.FC<Props> = ({ session, refreshing = false }) => {
  const email = session?.user?.email;
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h4">
          Inventory Management System
          {refreshing && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}{' '}
        </Typography>
      </Grid>
      <UserInformation email={email} />
    </Grid>
  );
};

export default Header;
