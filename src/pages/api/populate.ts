// pages/api/populate.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { count, supplierId: supplierIdInput } = req.body;

    const numberOfProducts = parseInt(count);
    const supplierId = parseInt(supplierIdInput, 10);

    if (isNaN(numberOfProducts) || numberOfProducts <= 0) {
      return res.status(400).json({ message: 'Invalid product count specified' });
    }

    if (isNaN(supplierId) || supplierId <= 0) {
      return res.status(400).json({ message: 'Invalid supplier ID specified' });
    }

    // Generate product data
    const timestamp = Date.now();
    const products = Array.from({ length: numberOfProducts }).map((_, index) => ({
      name: `Product ${timestamp} ${index + 1}`,
      price: parseFloat((Math.random() * 100).toFixed(2)), // Random price with 2 decimal places      quantity: Math.floor(Math.random() * 100), // Random quantity
      supplierId,
      quantity: Math.floor(Math.random() * 51), // Random quantity between 1 and 100    
    }));


    // Bulk insert products
    try {
      await prisma.product.createMany({
        data: products,
        skipDuplicates: true, // Optional: skip duplicates
      });

      return res.status(200).json({ message: `Successfully inserted ${numberOfProducts} products` });
    } catch (error) {
      console.error('Failed to populate products:', error);
      return res.status(500).json({ message: 'Failed to populate products' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
