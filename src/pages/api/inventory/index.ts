// pages/api/inventory/index.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type QueryParams = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // in-stock ie quantity > 0
  inStock?: boolean;
};

type ProductResponse = {
  data: any[]; // Replace `any` with your Product type or interface
  total: number;
  page: number;
  totalPages: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse | { error: string }>
) {
  const { page = '1', limit = '10', sortBy = 'name', sortOrder = 'asc', inStock } = req.query as QueryParams;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  let queryOptions = {
    take: limitNumber,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: {},
  };

  if (inStock) {
    queryOptions.where = {
      quantity: {
        gt: 0,
      },
    };
  }

  try {
    const products = await prisma.product.findMany(queryOptions);
    const total = await prisma.product.count({
      where: queryOptions.where,
    });

    res.status(200).json({
      data: products,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}
