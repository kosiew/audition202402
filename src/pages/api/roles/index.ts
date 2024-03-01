// pages/api/roles/index.ts
import { authorize } from '@/pages/api/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const permissionsRequired = [{ action: 'create', subject: 'Role' }];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAuthorized = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return; // Response is already handled in the authorize function

  try {
    if (req.method === 'POST') {
      const role = await prisma.role.create({
        data: req.body,
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
