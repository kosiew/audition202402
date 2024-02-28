// pages/api/add-inventory.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

const cloudinaryConfig = process.env.CLOUDINARY_CONFIG;
cloudinary.config(cloudinaryConfig);

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Form parsing error' });
      }

      let imageUrl = ''; // Initialize image URL as null

      // Check if there is an image file and it has a valid path
      if (files.image && files.image.filepath) {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(files.image.filepath);
        imageUrl = result.url; // Set the Cloudinary image URL
      }

      // Extract other form fields
      const { name, price, quantity, supplierName } = fields; // Adjust according to your form fields
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
            imageUrl
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