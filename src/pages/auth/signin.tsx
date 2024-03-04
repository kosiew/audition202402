// pages/auth/signin.tsx
import { Button, Container, TextField, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: true,
      email,
      password,
    });

    if (result?.error) {
      // Handle error messages
      console.error(result.error);
    } else {
      window.location.href = '/inventory';
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign In
        </Button>
      </form>
    </Container>
  );
}
