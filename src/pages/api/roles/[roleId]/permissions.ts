// pages/api/roles/[roleId]/permissions.ts
import { authorize } from '@/pages/api/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const permissionsRequired = [{ action: 'update', subject: 'Role' }];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAuthorized = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return; // Response is already handled in the authorize function

  const { roleId } = req.query;

  try {
    if (req.method === 'POST') {
      const { permissions } = req.body as { permissions: number[] };
      const role = await prisma.role.update({
        where: { id: parseInt(roleId as string) },
        data: {
          permissions: {
            connect: permissions.map((id) => ({ id })),
          },
        },
      });
      return res.status(200).json(role);
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
