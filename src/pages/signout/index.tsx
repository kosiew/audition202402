import { Button, Container, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';

const SignOutPage: React.FC = () => {
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
        onClick={() => signIn('credentials', { callbackUrl: '/inventory' })}
      >
        Sign In Again
      </Button>
    </Container>
  );
};

export default SignOutPage;
