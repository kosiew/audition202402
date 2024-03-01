// utils/auth.js
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

export const authorize = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
};
