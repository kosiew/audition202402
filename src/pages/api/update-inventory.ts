import { authorize } from '@/pages/api/utils/auth';
import { getImageUrl } from '@/pages/api/utils/getImageUrl';
import { getSupplier } from '@/pages/api/utils/getSupplier';
import prisma from '@/pages/api/utils/prisma';
import { IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

export const permissionsRequired = [{ action: 'update', subject: 'Product' }];

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Form parsing error' });
    }

    const id = parseInt(fields.id?.[0] || '');
    const name = fields.name?.[0].trim();
    const price = fields.price?.[0];
    const quantity = fields.quantity?.[0];
    const supplierName = fields.supplierName?.[0].trim();
    const reqImageUrl = fields.imageUrl?.[0].trim() || '';
    // Ensure all fields are present
    if (!name || !price || !quantity || !supplierName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const imageUrl = (await getImageUrl(reqImageUrl, files, res)) || '';

    try {
      const supplier = await getSupplier(supplierName);
      const data = {
        id,
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        supplierId: supplier.id,
        imageUrl,
      };
      const result = await prisma.product.update({
        where: { id },
        data,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error('Failed to update:', error);
      return res.status(500).json({ message: 'Failed to update' });
    }
  });
}
