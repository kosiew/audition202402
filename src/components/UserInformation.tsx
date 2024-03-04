import SignOutButton from '@/components/SignOutButton';
import { Grid, Typography } from '@mui/material';
import React from 'react';

type Props = {
  email?: string | null;
};

const UserInformation: React.FC<Props> = ({ email = '' }) => {
  return (
    <Grid item>
      <Typography variant="body1">Logged in as: {email}</Typography>
      <SignOutButton />
    </Grid>
  );
};

export default UserInformation;
