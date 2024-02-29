// pages/api/add-inventory.ts
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { Fields, Files, IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

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
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err: Error, fields: Fields, files: Files) => {
      if (err) {
        return res.status(500).json({ message: 'Form parsing error' });
      }
      const name = fields.name?.[0];
      const price = fields.price?.[0];
      const quantity = fields.quantity?.[0];
      const supplierName = fields.supplierName?.[0];

      let imageUrl = ''; // Initialize image URL as null

      if (files) {
        const file = files.file?.[0];
        if (file) {
          // Check if there is an image file and it has a valid path
          if (file.filepath) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(file.filepath);
            imageUrl = result.url; // Set the Cloudinary image URL
          }
        }
      }

      // Extract other form fields
      if (!name || !price || !quantity || !supplierName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      try {
        // Check if the supplier exists
        let supplier = await prisma.supplier.findUnique({
          where: { name: supplierName },
        });

        // If the supplier doesn't exist, create a new one
        if (!supplier) {
          supplier = await prisma.supplier.create({
            data: { name: supplierName },
          });
        }

        // Add the product with the supplierId
        const product = await prisma.product.create({
          data: {
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            supplierId: supplier.id,
            imageUrl,
          },
        });

        res.status(201).json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
