// pages/api/update-inventory.ts
import { authorize } from '@/pages/api/utils/auth';
import { getSupplier } from '@/pages/api/utils/getSupplier';
import prisma from '@/pages/api/utils/prisma';
import { Product, Supplier } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
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

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: NextApiResponse) {
  const { isAuthorized } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log(
    `%c==> [getting form data]`,
    'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
  );
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
    console.log(
      `%c==> [obtained form data]`,
      'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
    );
    // Ensure all fields are present
    if (!name || !price || !quantity || !supplierName) {
      console.log(
        `%c==> [missing data]`,
        'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
      );
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // @todo ==>  refactor this to a helper function
    let imageUrl = ''; // Initialize image URL as null
    if (files.file) {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (file.filepath) {
        try {
          const result = await cloudinary.uploader.upload(file.filepath);
          imageUrl = result.url; // Set the Cloudinary image URL
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      }
    }

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
      console.log(
        `%c==> [prisma.update+]`,
        'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
      );
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
