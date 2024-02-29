import { Box, Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type AddProductFormProps = {
  onAddProduct: (product: {
    name: string;
    price: string;
    quantity: string;
    supplierName: string;
    imageFile: File | null;
  }) => void;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierName, setSupplierName] = useState(''); // New state for supplier name

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    // Check if all form inputs have values before submitting
    if (!name || !price || !quantity || !supplierName) {
      alert('Please fill in all fields.');
      return;
    }
    onAddProduct({ name, price, quantity, supplierName, imageFile });
    // Reset form fields if necessary
    setName('');
    setPrice('');
    setQuantity('');
    setSupplierName('');
    setImageFile(null);
  };

  return (
    <div>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <TextField
        label="Supplier Name"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
      />

      {/* Drag and Drop File Input */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select an image</p>
        )}
        {imageFile && <p>{imageFile.name}</p>} {/* Display selected file name */}
      </Box>

      <Button onClick={handleSubmit}>Add Product</Button>
    </div>
  );
};

export default AddProductForm;
