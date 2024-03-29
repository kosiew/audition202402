import { authorize } from '@/pages/api/utils/auth';
import prisma from '@/pages/api/utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
export const permissionsRequired = [{ action: 'delete', subject: 'Product' }];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;

  if (req.method === 'DELETE') {
    const { productId } = req.query;

    const productIdNumber = parseInt(productId as string, 10);
    if (isNaN(productIdNumber)) {
      return res.status(400).json({ message: 'Product ID must be a valid number' });
    }

    try {
      // get the supplierid before delete
      const product = await prisma.product.findUnique({
        where: {
          id: productIdNumber,
        },
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const supplierId = product.supplierId;

      await prisma.product.delete({
        where: {
          id: productIdNumber,
        },
      });

      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
        include: { products: true },
      });
      if (supplier && supplier.products.length === 0) {
        await prisma.supplier.delete({ where: { id: supplierId } });
      }

      return res.status(204).end();
    } catch (error) {
      console.error('Failed to delete product:', error);
      return res.status(500).json({ message: 'Failed to delete product' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
