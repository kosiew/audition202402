import { SortBy } from '@/types/sortBy';
import { SortOrder } from '@/types/sortOrder';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

type Props = {
  limit: string;
  setLimit: React.Dispatch<React.SetStateAction<string>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  inStock: boolean;
  setInStock: React.Dispatch<React.SetStateAction<boolean>>;
  sortOrder: SortOrder;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
  filterProductName: string;
  setFilterProductName: React.Dispatch<React.SetStateAction<string>>;
  filterSupplierName: string;
  setFilterSupplierName: React.Dispatch<React.SetStateAction<string>>;
  filterPriceRange: [number, number];
  setFilterPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const SortFilterControls: React.FC<Props> = ({
  limit = '5',
  setLimit,
  sortBy,
  setSortBy,
  inStock,
  setInStock,
  sortOrder,
  setSortOrder,
  filterProductName,
  setFilterProductName,
  filterSupplierName,
  setFilterSupplierName,
  filterPriceRange,
  setFilterPriceRange,
}) => {
  const clearFilters = () => {
    setFilterProductName('');
    setFilterSupplierName('');
    setFilterPriceRange([0, Infinity]);
    setInStock(true);
  };

  return (
    <>
      <section>
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
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            label="Sort By"
          >
            <MenuItem value="name">Product Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)} // Cast to SortOrder type
            label="Sort Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </section>

      <section>
        <Typography variant="h6" py={1}>
          Filter
        </Typography>
        {/* filter controls as needed */}
        <TextField
          label="Product Name"
          value={filterProductName}
          onChange={(e) => setFilterProductName(e.target.value)}
        />
        <TextField
          label="Supplier Name"
          value={filterSupplierName}
          onChange={(e) => setFilterSupplierName(e.target.value)}
        />
        {/* You can create a range input or use two separate text fields for min and max price */}
        <TextField
          label="Minimum Price"
          type="number"
          value={filterPriceRange[0]}
          onChange={(e) => setFilterPriceRange([Number(e.target.value), filterPriceRange[1]])}
        />
        <TextField
          label="Maximum Price"
          type={filterPriceRange[1] === Infinity ? 'text' : 'number'}
          value={filterPriceRange[1] === Infinity ? 'Max' : filterPriceRange[1]}
          onChange={(e) => {
            let value;
            if (e.target.value === 'Max') {
              value = Infinity;
            } else if (isNaN(Number(e.target.value))) {
              value = 0;
            } else {
              value = Number(e.target.value);
            }
            setFilterPriceRange([filterPriceRange[0], value]);
          }}
        />

        <FormControlLabel
          sx={{ pl: '10px' }}
          control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} />}
          label="In Stock Only"
        />
        <Button variant="outlined" color="primary" onClick={clearFilters} sx={{ m: 1 }}>
          Clear Filters
        </Button>
      </section>
    </>
  );
};

export default SortFilterControls;
