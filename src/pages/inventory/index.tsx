import AddProductForm from '@/components/AddProductForm';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SignOutButton from '@/components/SignOutButton';
import SortFilterControls from '@/components/SortFilterControls';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Product } from '@/types/product';
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { Box, Grid, Typography, debounce } from '@mui/material';
import { Permission } from '@prisma/client';
import { useEffect, useState } from 'react';

const addProductPermission = { action: 'create', subject: 'Product' };
const editProductPermission = { action: 'update', subject: 'Product' };
const deleteProductPermission = { action: 'delete', subject: 'Product' };

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
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
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
      const { totalPages, products, filteredPermissions } = await response.json();

      setProducts(products);
      setTotalPages(totalPages);
      setFilteredPermissions(filteredPermissions);
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

  const canAddProduct = filteredPermissions.some((p) => p.action === addProductPermission.action);
  const canEditProduct = filteredPermissions.some((p) => p.action === editProductPermission.action);
  const canDeleteProduct = filteredPermissions.some(
    (p) => p.action === deleteProductPermission.action
  );

  if (!session) return <div>Loading...</div>; // Or a loading spinner

  return (
    <Box p={5}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4">Inventory Management System</Typography>
        </Grid>
        <Grid item>
          <SignOutButton />
        </Grid>
      </Grid>
      <Box pt={2}>
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
      </Box>
      <ProductTable
        products={products}
        canEditProduct={canEditProduct}
        canDeleteProduct={canDeleteProduct}
        updateProducts={updateProducts}
      />
      <Box py={2}>
        <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
      </Box>
      {canAddProduct && <AddProductForm updateProducts={updateProducts} />}
    </Box>
  );
};

export default InventoryPage;
