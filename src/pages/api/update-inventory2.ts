// pages/api/update-inventory.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export const permissionsRequired = [{ action: 'update', subject: 'Product' }];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(
    `%c==> [update-inventory2]`,
    'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
  );
  // const { isAuthorized } = await authorize(req, res, permissionsRequired);
  // if (!isAuthorized) return;

  try {
    // Ensure we're dealing with a POST request
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { type, id, data } = req.body;

    // Update a product
    if (type === 'product') {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data,
      });
      return res.status(200).json(updatedProduct);
    }

    // Update a supplier
    else if (type === 'supplier') {
      const updatedSupplier = await prisma.supplier.update({
        where: { id: Number(id) },
        data,
      });
      return res.status(200).json(updatedSupplier);
    }

    // If the type is not recognized
    else {
      return res.status(400).json({ message: 'Invalid update type specified' });
    }
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error updating inventory', details: error });
  }
}
