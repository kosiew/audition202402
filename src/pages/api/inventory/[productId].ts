// pages/api/inventory/[productId].ts
import { authorize } from '@/pages/api/utils/auth';
import { Product } from '@/types/product';
import { Permission, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export const permissionsRequired = [{ action: 'view', subject: 'Product' }];
type Response = {
  product: Product; // Replace `any` with your Product type or interface
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

    // Validate productId is a number
    if (isNaN(productIdNumber)) {
      return res.status(400).json({ message: 'Product ID must be a valid number' });
    }

    // Find the product by ID
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
