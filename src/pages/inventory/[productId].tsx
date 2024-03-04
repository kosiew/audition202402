// pages/inventory/[productId].tsx
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTriggerUpdate } from '@/hooks/useTriggerUpdate';
import { Product } from '@/types/product';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type ProductInput = Product & { supplierName?: string };

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

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const res = await fetch(`/api/inventory/${productId}`);
      const data = await res.json();
      const updatedProduct = { ...data.product, supplierName: data.product.supplier.name };
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
    const formData = new FormData();
    formData.append('id', productId as string);
    formData.append('name', product?.name || '');
    formData.append('price', product?.price.toString() || '');
    formData.append('quantity', product?.quantity.toString() || '');
    formData.append('supplierName', product?.supplierName || '');
    // Append the image file to the form data if one exists
    if (imageFile) {
      formData.append('file', imageFile, imageFile.name);
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
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    setRefreshing(true);
    try {
      const res = await fetch(`/api/delete-inventory?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      setRefreshing(false);

      router.push('/inventory');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }
  return (
    <Container>
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
            />
            <TextField
              label="Quantity"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
            />
            <TextField
              label="Supplier Name"
              value={product.supplierName}
              onChange={(e) => setProduct({ ...product, supplierName: e.target.value })}
            />
            <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
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
        <Button color="primary" onClick={handleEdit}>
          Edit
        </Button>
      )}
      <Button color="secondary" onClick={handleDelete}>
        Delete
      </Button>
    </Container>
  );
};

export default ProductPage;
