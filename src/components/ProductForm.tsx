import { Box, Button, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ProductFormProps {
  onAddProduct: (product: any) => void; // Define a more specific type based on your actual product structure
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <TextField label="Name" /* Bind these fields to your form state */ />
      <TextField label="Price" /* Bind these fields to your form state */ />
      <TextField label="Quantity" /* Bind these fields to your form state */ />

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
        {imageFile && <p>{imageFile.name}</p>}
      </Box>

      <Button
        onClick={() =>
          onAddProduct({
            /* Pass form data here */
          })
        }
      >
        Add Product
      </Button>
    </div>
  );
};

export default ProductForm;
