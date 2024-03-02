import { Supplier, Product as _Product } from '@prisma/client';

export type Product = _Product & {
  supplier: Supplier;
};
