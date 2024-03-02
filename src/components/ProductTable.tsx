import { Product } from '@/types/product';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
interface Props {
  products: Product[];
  canEditProduct: boolean;
  canDeleteProduct: boolean;
}

const ProductTable: React.FC<Props> = ({ products = [], canDeleteProduct, canEditProduct }) => {
  const router = useRouter();

  const handleEdit = (productId: number) => {
    router.push(`/inventory/${productId}`);
  };

  const handleDelete = (productId: number) => {
    // Delete the product here
    // ...
  };
  return (
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
              {(canDeleteProduct || canEditProduct) && <TableCell align="right">Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell component="th" scope="row">
                  {product.imageUrl.length > 0 ? (
                    <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
                      {product.name}
                    </a>
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.supplier.name}</TableCell>
                <TableCell align="right">
                  {canEditProduct && (
                    <IconButton onClick={() => handleEdit(product.id)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {canDeleteProduct && (
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductTable;
