// pages/api/permissions/index.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // await authorize(req);

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
