// pages/api/update-inventory.ts
import { authorize } from '@/pages/api/utils/auth';
import prisma from '@/pages/api/utils/prisma';
import { Product, Supplier } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
type Request = NextApiRequest & {
  body: {
    id: number;
    type: string;
    data: Product | Supplier;
  };
};
export const permissionsRequired = [{ action: 'update', subject: 'Product' }];
export default async function handler(req: Request, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;

  if (req.method === 'POST') {
    const { id, type, data } = req.body;

    try {
      // Validate input
      if (!id || !type || !data) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let result;

      if (type === 'product') {
        result = await prisma.product.update({
          where: { id: parseInt(id, 10) },
          data,
        });
      } else if (type === 'supplier') {
        result = await prisma.supplier.update({
          where: { id: parseInt(id, 10) },
          data,
        });
      } else {
        return res.status(400).json({ message: 'Invalid type specified' });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Failed to update:', error);
      return res.status(500).json({ message: 'Failed to update' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
