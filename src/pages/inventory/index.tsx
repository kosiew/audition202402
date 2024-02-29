import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  PaginationItem,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  supplierId: number;
};

const InventoryPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [limit, setLimit] = useState('10');
  const [quantity, setQuantity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [inStock, setInStock] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Assuming you want to use only the first file
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit,
        sortBy,
        sortOrder,
        inStock: inStock.toString(),
      }).toString();

      const response = await fetch(`/api/inventory?${queryParams}`);
      const data = await response.json();

      setProducts(data.data);
      setTotalPages(data.totalPages);
      // Set additional state as necessary, e.g., total pages for pagination
    };

    fetchProducts();
  }, [page, limit, sortBy, sortOrder, inStock]); // Ensure effect runs when these values change

  const handleAddProduct = async () => {
    // Implement product addition logic
  };

  return (
    <div>
      <h1>Inventory</h1>

      {/* Sorting and Filtering Controls */}
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Items per Page</InputLabel>
        <Select value={limit} onChange={(e) => setLimit(e.target.value)} label="Items per Page">
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="50">50</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          {/* Add other options as needed */}
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} />}
        label="In Stock Only"
      />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} />
      <div>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <TextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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

        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </div>
  );
};

export default InventoryPage;
