// Example for a protected page
import { useSession } from 'next-auth/react';

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Handle unauthenticated users
    },
  });

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return <div>Welcome, {session?.user?.name}!</div>;
}
