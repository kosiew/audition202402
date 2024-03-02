// pages/api/add-inventory.ts
import { authorize } from '@/pages/api/utils/auth';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const permissionsRequired = [{ action: 'create', subject: 'Product' }];

const cloudinaryConfig = process.env.CLOUDINARY_CONFIG;
if (!cloudinaryConfig) {
  throw new Error('CLOUDINARY_CONFIG is not defined in .env');
}

try {
  const configOptions = JSON.parse(cloudinaryConfig);
  cloudinary.config(configOptions);
} catch (error) {
  console.error('Failed to parse CLOUDINARY_CONFIG:', error);
  throw new Error('Failed to parse CLOUDINARY_CONFIG');
}
// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAuthorized = await authorize(req, res, permissionsRequired);
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

    const name = fields.name?.[0];
    const price = fields.price?.[0];
    const quantity = fields.quantity?.[0];
    const supplierName = fields.supplierName?.[0];

    // Ensure all fields are present
    if (!name || !price || !quantity || !supplierName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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
      // Logic to handle supplier and product creation
      let supplier = await prisma.supplier.findUnique({
        where: { name: supplierName },
      });

      if (!supplier) {
        supplier = await prisma.supplier.create({
          data: { name: supplierName },
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          supplierId: supplier.id,
          imageUrl,
        },
      });

      return res.status(201).json(product);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return res.status(500).json({ message: 'Error adding product' });
    }
  });
}
