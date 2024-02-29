import AddProductForm from '@/components/AddProductForm';
import PaginationControl from '@/components/PaginationControl';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
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

      <ProductForm onAddProduct={handleAddProduct} />
      <ProductTable products={products} />
      <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
};

export default InventoryPage;
