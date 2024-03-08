import AddProductForm from '@/components/AddProductForm';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import PaginationControl from '@/components/PaginationControl';
import ProductTable from '@/components/ProductTable';
import SortFilterControls from '@/components/SortFilterControls';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTriggerUpdate } from '@/hooks/useTriggerUpdate';
import { Product } from '@/types/product';
import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import { Box } from '@mui/material';
import { Permission } from '@prisma/client';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

const addProductPermission = { action: 'create', subject: 'Product' };
const editProductPermission = { action: 'update', subject: 'Product' };
const deleteProductPermission = { action: 'delete', subject: 'Product' };

const InventoryPage = () => {
  const session = useRequireAuth(); // This will redirect if not authenticated

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
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
  const prevFilterProductName = useRef(filterProductName);
  const prevFilterSupplierName = useRef(filterSupplierName);
  const prevFilterPriceRange = useRef(filterPriceRange);
  const prevInStock = useRef(inStock);
  const [, startTransition] = useTransition();
  const maxPrice = isNaN(Number(filterPriceRange[1])) ? 'Infinity' : filterPriceRange[1].toString();

  const fetchProducts = useCallback(
    async (filtersChanged: boolean) => {
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

      const response = await fetch(`/api/inventory?${queryParams}`);
      const { totalPages, products, filteredPermissions } = await response.json();

      startTransition(() => {
        setProducts(products);
        setTotalPages(totalPages);
        setFilteredPermissions(filteredPermissions);
        if (filtersChanged) {
          setPage(1);
        }
      });
    },
    [
      page,
      limit,
      sortBy,
      sortOrder,
      inStock,
      filterProductName,
      filterSupplierName,
      filterPriceRange,
      maxPrice,
    ]
  );
  useEffect(() => {
    const filtersChanged =
      prevFilterProductName.current !== filterProductName ||
      prevFilterSupplierName.current !== filterSupplierName ||
      prevFilterPriceRange.current !== filterPriceRange ||
      prevInStock.current !== inStock;
    const fetchData = async () => {
      setRefreshing(true);
      await fetchProducts(filtersChanged);
      setRefreshing(false);
    };

    fetchData();
    prevFilterProductName.current = filterProductName;
    prevFilterSupplierName.current = filterSupplierName;
    prevFilterPriceRange.current = filterPriceRange;
    prevInStock.current = inStock;
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
    fetchProducts,
  ]); // Ensure effect runs when these values change

  const canAddProduct = filteredPermissions.some((p) => p.action === addProductPermission.action);
  const canEditProduct = filteredPermissions.some((p) => p.action === editProductPermission.action);
  const canDeleteProduct = filteredPermissions.some(
    (p) => p.action === deleteProductPermission.action
  );

  if (!session) {
    return <Loading />;
  }
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
