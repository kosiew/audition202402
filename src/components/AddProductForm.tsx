import { Box, Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type AddProductFormProps = {
  onAddProduct: (product: {
    name: string;
    price: string;
    quantity: string;
    imageFile: File | null;
  }) => void;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    onAddProduct({ name, price, quantity, imageFile });
    // Reset form fields if necessary
    setName('');
    setPrice('');
    setQuantity('');
    setImageFile(null);
  };

  return (
    <div>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

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
