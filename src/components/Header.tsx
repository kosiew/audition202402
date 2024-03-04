import UserInformation from '@/components/UserInformation';
import { Grid, Typography } from '@mui/material';
import { Session } from 'next-auth';
import React from 'react';

type Props = {
  session: Session | null;
};

const Header: React.FC<Props> = ({ session }) => {
  const email = session?.user?.email;
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h4">Inventory Management System</Typography>
      </Grid>

      <UserInformation email={email} />
    </Grid>
  );
};

export default Header;
