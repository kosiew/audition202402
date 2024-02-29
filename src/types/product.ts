import { Supplier } from '@prisma/client';

export type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  supplier: Supplier;
};
