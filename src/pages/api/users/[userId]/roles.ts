import { authorize } from '@/pages/api/utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/pages/api/utils/prisma';
const permissionsRequired = [{ action: 'update', subject: 'User' }];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;

  const { userId } = req.query;

  try {
    if (req.method === 'POST') {
      const { roles } = req.body as { roles: number[] };
      const user = await prisma.user.update({
        where: { id: parseInt(userId as string) },
        data: {
          roles: {
            connect: roles.map((id) => ({ id })),
          },
        },
      });
      return res.status(200).json(user);
    } else {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ error: error.message });
    } else {
      return res.status(401).json({ error: 'An unknown error occurred.' });
    }
  }
}
