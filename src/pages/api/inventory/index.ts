// pages/api/inventory/index.ts
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type QueryParams = {
  page?: string;
  limit?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  // in-stock ie quantity > 0
  inStock?: String;
  productName?: string;
  supplierName?: string;
  minPrice?: string;
  maxPrice?: string;
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
  const {
    page = '1',
    limit = '10',
    sortBy = 'name',
    sortOrder = 'asc',
    inStock = 'true',
    productName = '',
    supplierName = '',
    minPrice = '0',
    maxPrice = 'Infinity',
  } = req.query as QueryParams;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const minPriceNumber = parseFloat(minPrice);
  const maxPriceNumber = maxPrice === 'Infinity' ? Infinity : parseFloat(maxPrice);
  let queryOptions = {
    take: limitNumber,
    skip,
    orderBy: { [sortBy]: sortOrder },
    where: {},
  };

  const inStockBool = inStock === 'true';

  queryOptions.where = {
    quantity: {
      [inStockBool ? 'gt' : 'equals']: 0,
    },
    price: {
      ...(minPriceNumber !== -Infinity && { gte: minPriceNumber }),
      ...(maxPriceNumber !== Infinity && { lte: maxPriceNumber }),
    },
    name: {
      contains: productName,
      mode: 'insensitive',
    },
    // Case-insensitive substring search for supplier name through a relation
    supplier: {
      name: {
        contains: supplierName,
        mode: 'insensitive',
      },
    },
  };

  try {
    const products = await prisma.product.findMany({
      ...queryOptions,
      include: {
        supplier: true,
      },
    });
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
