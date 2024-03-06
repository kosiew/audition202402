import { useSnackbar } from '@/hooks/useSnackbar';
import { Product } from '@/types/product';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
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
  updateProducts: () => void;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductTable: React.FC<Props> = ({
  products = [],
  canDeleteProduct,
  canEditProduct,
  updateProducts,
  setRefreshing,
}) => {
  const router = useRouter();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const onlyViewProduct = !canDeleteProduct && !canEditProduct;

  const handleViewOrEdit = (productId: number) => {
    router.push(`/inventory/${productId}`);
  };

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      setRefreshing(true);
      showSnackbar('Deleting product...');
      const res = await fetch(`/api/delete-inventory?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      updateProducts(); // Refresh the product list here
      setRefreshing(false);
      showSnackbar('Deleted product successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
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
              <TableCell align="right">Action</TableCell>
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
                  {onlyViewProduct && (
                    <IconButton onClick={() => handleViewOrEdit(product.id)}>
                      <Visibility />
                    </IconButton>
                  )}
                  {canEditProduct && (
                    <IconButton onClick={() => handleViewOrEdit(product.id)}>
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
      <SnackbarComponent />
    </>
  );
};

export default ProductTable;
