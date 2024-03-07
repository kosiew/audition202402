import { Product } from '@prisma/client';
import React from 'react';

type Props = {
  product: Product;
};

const ProductImage: React.FC<Props> = ({ product }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={product.imageUrl} alt={product.name} style={{ width: '30%', height: 'auto' }} />;
};

export default ProductImage;
