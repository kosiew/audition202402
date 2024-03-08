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
import { useCallback, useEffect, useReducer, useRef, useState, useTransition } from 'react';

const addProductPermission = { action: 'create', subject: 'Product' };
const editProductPermission = { action: 'update', subject: 'Product' };
const deleteProductPermission = { action: 'delete', subject: 'Product' };
const initialFilterState = {
  productName: '',
  supplierName: '',
  priceRange: [0, Infinity],
  inStock: true,
};

export type FilterState = typeof initialFilterState;

export type FilterAction =
  | { type: 'SET_PRODUCT_NAME'; payload: string }
  | { type: 'SET_SUPPLIER_NAME'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'SET_IN_STOCK'; payload: boolean }
  | { type: 'CLEAR_ALL_FILTERS' };

const InventoryPage = () => {
  const session = useRequireAuth(); // This will redirect if not authenticated

  function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
      case 'SET_PRODUCT_NAME':
        return { ...state, productName: action.payload };
      case 'SET_SUPPLIER_NAME':
        return { ...state, supplierName: action.payload };
      case 'SET_PRICE_RANGE':
        return { ...state, priceRange: action.payload };
      case 'SET_IN_STOCK':
        return { ...state, inStock: action.payload };
      case 'CLEAR_ALL_FILTERS':
        return initialFilterState;
      default:
        throw new Error();
    }
  }

  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [limit, setLimit] = useState('5');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const { trigger, triggerUpdate } = useTriggerUpdate();
  const previousFilterState = useRef(filterState);
  const [, startTransition] = useTransition();
  const maxPrice = isNaN(Number(filterState.priceRange[1]))
    ? 'Infinity'
    : filterState.priceRange[1].toString();

  const fetchProducts = useCallback(
    async (filtersChanged: boolean) => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit,
        sortBy,
        sortOrder,
        inStock: filterState.inStock.toString(),
        productName: filterState.productName,
        supplierName: filterState.supplierName,
        minPrice: filterState.priceRange[0].toString(),
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
    [page, limit, sortBy, sortOrder, filterState, maxPrice]
  );
  useEffect(() => {
    const filtersChanged =
      previousFilterState.current.productName !== filterState.productName ||
      previousFilterState.current.supplierName !== filterState.supplierName ||
      previousFilterState.current.priceRange !== filterState.priceRange ||
      previousFilterState.current.inStock !== filterState.inStock;
    const fetchData = async () => {
      setRefreshing(true);
      await fetchProducts(filtersChanged);
      setRefreshing(false);
    };

    fetchData();
    previousFilterState.current = filterState;
  }, [page, limit, sortBy, sortOrder, trigger, filterState, fetchProducts]); // Ensure effect runs when these values change

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
          filterState={filterState}
          dispatch={dispatch}
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
