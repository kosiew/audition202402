import AddProductForm from '@/components/AddProductForm';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SortFilterControls, { SortBy, SortOrder } from '@/components/SortFilterControls';
import { Product } from '@/types/product';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const InventoryPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [limit, setLimit] = useState('10');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [inStock, setInStock] = useState(true);
  const [trigger, setTrigger] = useState(0);

  // To trigger a state change, increment the counter
  const updateProducts = () => setTrigger((trigger) => trigger + 1);
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
  }, [page, limit, sortBy, sortOrder, inStock, trigger]); // Ensure effect runs when these values change

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
      <AddProductForm updateProducts={updateProducts} />
    </div>
  );
};

export default InventoryPage;
