// pages/api/inventory/[productId].ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
}
