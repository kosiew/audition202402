// pages/api/update-inventory.ts
import { authorize } from '@/pages/api/utils/auth';
import { getSupplier } from '@/pages/api/utils/getSupplier';
import prisma from '@/pages/api/utils/prisma';
import { Product, Supplier } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type ProductWithSupplierName = Product & { supplierName?: string };
type Request = NextApiRequest & {
  body: {
    id: number;
    type: string;
    data: ProductWithSupplierName | Supplier;
  };
};
export const permissionsRequired = [{ action: 'update', subject: 'Product' }];
export default async function handler(req: Request, res: NextApiResponse) {
  console.log(
    `%c==> [api-update handler]`,
    'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
  );
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;
  console.log(
    `%c==> [api update authorized]`,
    'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
  );

  if (req.method === 'POST') {
    const { id, type, data } = req.body;

    try {
      // Validate input
      if (!id || !type || !data) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let result;

      if (type === 'product') {
        console.log(
          `%c==> [api-update product]`,
          'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
        );
        const { supplierName, ...dataWithoutSupplierName } = data;
        if (supplierName) {
          const supplier = await getSupplier(data.supplierName);
          dataWithoutSupplierName.supplierId = supplier.id;
        }
        result = await prisma.product.update({
          where: { id: parseInt(id, 10) },
          data: dataWithoutSupplierName,
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
