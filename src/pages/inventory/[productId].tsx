import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useTriggerUpdate } from '@/hooks/useTriggerUpdate';
import { Product } from '@/types/product';
import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Permission } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type ProductInput = Product & { supplierName?: string };
const editProductPermission = { action: 'update', subject: 'Product' };
const deleteProductPermission = { action: 'delete', subject: 'Product' };

const ProductPage = () => {
  const session = useRequireAuth(); // This will redirect if not authenticated
  const router = useRouter();
  const { productId } = router.query;
  const { trigger, triggerUpdate } = useTriggerUpdate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [product, setProduct] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const res = await fetch(`/api/inventory/${productId}`);
      const { product, filteredPermissions } = await res.json();
      setFilteredPermissions(filteredPermissions);
      const updatedProduct = { ...product, supplierName: product.supplier.name };
      setProduct(updatedProduct);
      setLoading(false);
    };
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  }, [productId, trigger]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setRefreshing(true);
    showSnackbar('Saving product...');
    const formData = new FormData();
    formData.append('id', productId as string);
    formData.append('name', product?.name || '');
    formData.append('price', product?.price.toString() || '');
    formData.append('quantity', product?.quantity.toString() || '');
    formData.append('supplierName', product?.supplierName || '');
    // Append the image file to the form data if one exists
    if (imageFile) {
      formData.append('file', imageFile, imageFile.name);
    } else if (product?.imageUrl) {
      formData.append('imageUrl', product.imageUrl);
    }
    if (!product || !product.supplierName) return;
    try {
      const res = await fetch(`/api/update-inventory`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      triggerUpdate();
      setEditing(false);
      setRefreshing(false);
      showSnackbar('Saved product successfully');
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    setRefreshing(true);
    showSnackbar('Deleting product...');
    try {
      const res = await fetch(`/api/delete-inventory?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      setRefreshing(false);
      showSnackbar('Deleted product successfully');

      router.push('/inventory');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const canEditProduct = filteredPermissions.some((p) => p.action === editProductPermission.action);
  const canDeleteProduct = filteredPermissions.some(
    (p) => p.action === deleteProductPermission.action
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }
  return (
    <>
      <Box p={5}>
        <Header session={session} refreshing={refreshing} />
        <Grid container spacing={2} alignItems="center">
          {editing ? (
            <Box pt={5}>
              <TextField
                label="Name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
              <TextField
                label="Price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                inputProps={{ step: '0.01', min: '0', type: 'number' }}
              />
              <TextField
                label="Quantity"
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                inputProps={{ min: '0', type: 'number' }}
              />
              <TextField
                label="Supplier Name"
                value={product.supplierName}
                onChange={(e) => setProduct({ ...product, supplierName: e.target.value })}
              />
              <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
              {product.imageUrl && (
                <Box mt={2}>
                  <Typography variant="body1">Existing Image:</Typography>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '30%', height: 'auto' }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Grid item>
                <Typography variant="h6">Product Name</Typography>
                <Typography variant="body1">{product.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Price</Typography>
                <Typography variant="body1">{product.price.toFixed(2)}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Quantity</Typography>
                <Typography variant="body1">{product.quantity}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Supplier</Typography>
                <Typography variant="body1">{product.supplier.name}</Typography>
              </Grid>
              {product.imageUrl && (
                <Grid container ml={2}>
                  <Grid item>
                    <Box>
                      <Typography variant="h6">Image</Typography>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '30%', height: 'auto' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Grid>
        <Box mt={2} />
        {editing ? (
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        ) : (
          canEditProduct && (
            <Button color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )
        )}
        {canDeleteProduct && (
          <Button color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Box>
      <SnackbarComponent />
    </>
  );
};

export default ProductPage;
