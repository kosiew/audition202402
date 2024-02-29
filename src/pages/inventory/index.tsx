import AddProductForm from '@/components/AddProductForm';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SortFilterControls, { SortOrder } from '@/components/SortFilterControls';
import { Product } from '@/types/product';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const InventoryPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [limit, setLimit] = useState('10');
  const [quantity, setQuantity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [inStock, setInStock] = useState(true);

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
    // Create a FormData instance to build the form data payload
    const formData = new FormData();

    // Append the product fields to the form data
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
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

      // Parse the JSON response
      const result = await response.json();

      // Optionally, clear the form fields and update the UI accordingly
      setName('');
      setPrice('');
      setQuantity('');
      setImageFile(null);

      // Add the new product to the products state to update the list
      setProducts([...products, result]);

      // Additional logic like closing a modal or showing a success message
    } catch (error) {
      console.error('Failed to add product:', error);
      // Handle errors like showing an error message to the user
    }
  };

  return (
    <div>
      <h1>Inventory</h1>

      <SortFilterControls
        limit={limit}
        setLimit={setLimit}
        sortBy={sortBy}
        setSortBy={setSortBy}
        inStock={inStock}
        setInStock={setInStock}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <ProductTable products={products} />
      <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
};

export default InventoryPage;
