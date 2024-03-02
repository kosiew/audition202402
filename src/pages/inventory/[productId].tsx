// pages/inventory/[productId].tsx
import { Product } from '@/types/product';
import { Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProductPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const res = await fetch(`/api/inventory/${productId}`);
      const data = await res.json();
      setProduct(data.product);
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    // Save the changes here
    // ...

    setEditing(false);
  };

  const handleDelete = async () => {
    // Delete the product here
    // ...

    router.push('/inventory');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Container>
      {editing ? (
        <TextField
          label="Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
      ) : (
        <Typography variant="h4">{product.name}</Typography>
      )}
      {editing ? (
        <TextField
          label="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
        />
      ) : (
        <Typography variant="h6">{product.price.toFixed(2)}</Typography>
      )}
      {/* Display other product properties here */}
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
