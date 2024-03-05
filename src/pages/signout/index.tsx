import { Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

const SignOutPage: React.FC = () => {
  const router = useRouter();
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        You have been signed out
      </Typography>
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => router.push('/auth/signin')}
      >
        Sign In Again
      </Button>
    </Container>
  );
};

export default SignOutPage;
