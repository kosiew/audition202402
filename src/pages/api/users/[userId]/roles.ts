// pages/api/users/[userId]/roles.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { authorize } from '../../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  try {
    await authorize(req);

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
