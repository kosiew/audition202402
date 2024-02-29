import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => (
  <TableContainer component={Paper}>
    <Table aria-label="product table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="right">Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell component="th" scope="row">
              {product.name}
            </TableCell>
            <TableCell align="right">{product.price}</TableCell>
            <TableCell align="right">{product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ProductTable;
