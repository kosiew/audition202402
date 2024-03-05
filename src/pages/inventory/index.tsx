import AddProductForm from '@/components/AddProductForm';
import Header from '@/components/Header';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SortFilterControls from '@/components/SortFilterControls';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTriggerUpdate } from '@/hooks/useTriggerUpdate';
import { Product } from '@/types/product';
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { Box, debounce } from '@mui/material';
import { Permission } from '@prisma/client';
import React, { useEffect, useState } from 'react';

const addProductPermission = { action: 'create', subject: 'Product' };
const editProductPermission = { action: 'update', subject: 'Product' };
const deleteProductPermission = { action: 'delete', subject: 'Product' };

const InventoryPage = () => {
  const session = useRequireAuth(); // This will redirect if not authenticated

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [limit, setLimit] = useState('5');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [inStock, setInStock] = useState(true);
  const [filterProductName, setFilterProductName] = useState('');
  const [filterSupplierName, setFilterSupplierName] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, Infinity]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const { trigger, triggerUpdate } = useTriggerUpdate();

  useEffect(() => {
    const maxPrice = isNaN(Number(filterPriceRange[1]))
      ? 'Infinity'
      : filterPriceRange[1].toString();
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
        maxPrice,
      }).toString();

      setRefreshing(true);
      const response = await fetch(`/api/inventory?${queryParams}`);
      const { totalPages, products, filteredPermissions } = await response.json();

      setProducts(products);
      setTotalPages(totalPages);
      setFilteredPermissions(filteredPermissions);
      setRefreshing(false);
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

  // switch to page 1 whenever filters change
  useEffect(() => {
    const debouncedSetPage = debounce(() => setPage(1), 500);
    debouncedSetPage();
  }, [filterProductName, filterSupplierName, filterPriceRange, inStock]);

  const canAddProduct = filteredPermissions.some((p) => p.action === addProductPermission.action);
  const canEditProduct = filteredPermissions.some((p) => p.action === editProductPermission.action);
  const canDeleteProduct = filteredPermissions.some(
    (p) => p.action === deleteProductPermission.action
  );

  if (!session) return <div>Loading...</div>; // Or a loading spinner

  return (
    <Box p={5}>
      <Header session={session} refreshing={refreshing}></Header>
      <Box pt={2}>
        <SortFilterControls
          limit={limit}
          setLimit={setLimit}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          inStock={inStock}
          setInStock={setInStock}
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
        updateProducts={triggerUpdate}
        setRefreshing={setRefreshing}
      />
      <Box py={2}>
        <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
      </Box>
      {canAddProduct && (
        <AddProductForm updateProducts={triggerUpdate} setRefreshing={setRefreshing} />
      )}
    </Box>
  );
};

export default InventoryPage;
