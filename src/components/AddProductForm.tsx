import ImageUpload from '@/components/ImageUpload';
import { Button, Dialog, DialogActions, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
  updateProducts: () => void;
}

const AddProductForm: React.FC<Props> = ({ updateProducts }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierName, setSupplierName] = useState(''); // New state for supplier name
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const clearForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setSupplierName('');
    setImageFile(null);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage(null);
    clearForm();
  };

  const handleAddProduct = async () => {
    // Check if all form inputs have values before submitting
    if (!name || !price || !quantity || !supplierName) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a FormData instance to build the form data payload
    const formData = new FormData();

    // Append the product fields to the form data
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('supplierName', supplierName);
    // Append other necessary fields like supplierName, etc.

    // Append the image file to the form data if one exists
    if (imageFile) {
      formData.append('file', imageFile, imageFile.name);
    }

    // Send a POST request to the server with the form data
    try {
      const response = await fetch('/api/add-inventory', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      updateProducts(); // Trigger a state update to refresh the product list

      // Optionally, clear the form fields and update the UI accordingly
      clearForm();
      // Additional logic like closing a modal or showing a success message
    } catch (error) {
      const errorMessage = 'Failed to add product';
      console.error(errorMessage, error);
      setErrorMessage(errorMessage);
      setOpen(true);
      // Handle errors like showing an error message to the user
    }
  };

  return (
    <div>
      <Typography variant="h6">Add Product</Typography>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <TextField
        label="Supplier Name"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
      />
      {/* Drag and Drop File Input */}
      <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
      <Dialog open={!!errorMessage || open} onClose={handleClose}>
        <DialogTitle>{errorMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>{' '}
      <Button sx={{ mt: 2 }} variant="outlined" color="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
    </div>
  );
};

export default AddProductForm;
