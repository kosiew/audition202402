import { authorize } from '@/pages/api/utils/auth';
import { Product } from '@/types/product';
import { Permission } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/pages/api/utils/prisma';
export const permissionsRequired = [{ action: 'view', subject: 'Product' }];
type Response = {
  product: Product;
  filteredPermissions: Permission[];
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | { error: string } | { message: string }>
) {
  const { isAuthorized, filteredPermissions } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return; // Response is already handled in the authorize function

  // Extract the productId from the URL query
  const { productId } = req.query;

  try {
    const productIdNumber = parseInt(productId as string);

    if (isNaN(productIdNumber)) {
      return res.status(400).json({ message: 'Product ID must be a valid number' });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productIdNumber,
      },
      include: {
        supplier: true,
      },
    });

    if (product) {
      res.status(200).json({ product, filteredPermissions });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
}
