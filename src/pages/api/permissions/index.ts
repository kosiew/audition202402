import { authorize } from '@/pages/api/utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/pages/api/utils/prisma';
const permissionsRequired = [{ action: 'create', subject: 'Permission' }];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return; // Response is already handled in the authorize function

  try {
    if (req.method === 'POST') {
      const permission = await prisma.permission.create({
        data: req.body,
      });
      return res.status(200).json(permission);
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
