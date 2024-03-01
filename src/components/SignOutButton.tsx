import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

const SignOutButton: React.FC = () => (
  <Button onClick={() => signOut({ redirect: true, callbackUrl: '/signout' })}>Sign Out</Button>
);

export default SignOutButton;
