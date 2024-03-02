import { Product } from '@/types/product';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

interface Props {
  products: Product[];
}

const ProductTable: React.FC<Props> = ({ products = [] }) => (
  <>
    <Typography variant="h6" pt={1}>
      Product Table
    </Typography>
    <TableContainer component={Paper}>
      <Table aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Supplier Name</TableCell>
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
              <TableCell align="right">{product.supplier.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default ProductTable;
