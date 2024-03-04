// pages/api/inventory/index.ts
import { authorize } from '@/pages/api/utils/auth';
import prisma from '@/pages/api/utils/prisma';
import { Product } from '@/types/product';
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { Permission } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

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

type Response = {
  products: Product[]; // Replace `any` with your Product type or interface
  total: number;
  page: number;
  totalPages: number;
  filteredPermissions: Permission[];
};
export const permissionsRequired = [{ action: 'view', subject: 'Product' }];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | { error: string }>
) {
  const { isAuthorized, filteredPermissions } = await authorize(req, res, permissionsRequired);
  if (!isAuthorized) return; // Response is already handled in the authorize function

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
  console.log(
    `%c==> [api]`,
    'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;',
    { maxPrice }
  );
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
      ...(maxPriceNumber !== Infinity ? { lte: maxPriceNumber } : {}),
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
      products,
      total,
      filteredPermissions,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}
