// hooks/useRequireAuth.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useRequireAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  return session; // Return the session so you can use it in your component
};
