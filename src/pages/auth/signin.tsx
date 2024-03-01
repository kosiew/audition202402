// pages/auth/signin.tsx
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      // Handle error messages
      console.error(result.error);
    } else {
      // Redirect to the protected page
      window.location.href = '/';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}
