import UserInformation from '@/components/UserInformation';
import { Grid, Typography } from '@mui/material';
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
          {refreshing && <span>...refreshing</span>}{' '}
        </Typography>
      </Grid>
      <UserInformation email={email} />
    </Grid>
  );
};

export default Header;
