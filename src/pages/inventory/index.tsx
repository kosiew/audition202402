import AddProductForm from '@/components/AddProductForm';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SignOutButton from '@/components/SignOutButton';
import SortFilterControls from '@/components/SortFilterControls';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Product } from '@/types/product';
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { debounce } from '@mui/material';
import { useEffect, useState } from 'react';

const InventoryPage = () => {
  const session = useRequireAuth(); // This will redirect if not authenticated

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [limit, setLimit] = useState('10');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [inStock, setInStock] = useState(true);
  const [trigger, setTrigger] = useState(0);
  const [filterProductName, setFilterProductName] = useState('');
  const [filterSupplierName, setFilterSupplierName] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, Infinity]);

  // To trigger a state change, increment the counter
  const updateProducts = () => setTrigger((trigger) => trigger + 1);

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit,
        sortBy,
        sortOrder,
        inStock: inStock.toString(),
        productName: filterProductName,
        supplierName: filterSupplierName,
        minPrice: filterPriceRange[0].toString(),
        maxPrice: filterPriceRange[1].toString(),
      }).toString();

      const response = await fetch(`/api/inventory?${queryParams}`);
      const data = await response.json();

      setProducts(data.data);
      setTotalPages(data.totalPages);
    };

    // debounce the fetchProducts function to prevent rapid API calls
    const debouncedFetchProducts = debounce(fetchProducts, 500);
    debouncedFetchProducts();
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    inStock,
    trigger,
    filterPriceRange,
    filterProductName,
    filterSupplierName,
  ]); // Ensure effect runs when these values change
  if (!session) return <div>Loading...</div>; // Or a loading spinner

  return (
    <div>
      <h1>Inventory</h1>

      <SignOutButton />

      <SortFilterControls
        limit={limit}
        setLimit={setLimit}
        sortBy={sortBy}
        setSortBy={setSortBy}
        inStock={inStock}
        setInStock={setInStock}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterProductName={filterProductName}
        setFilterProductName={setFilterProductName}
        filterSupplierName={filterSupplierName}
        setFilterSupplierName={setFilterSupplierName}
        filterPriceRange={filterPriceRange}
        setFilterPriceRange={setFilterPriceRange}
      />
      <ProductTable products={products} />
      <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
      <AddProductForm updateProducts={updateProducts} />
    </div>
  );
};

export default InventoryPage;
