import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';

export type SortOrder = 'asc' | 'desc';

type SortFilterControlsProps = {
  limit: string;
  setLimit: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  inStock: boolean;
  setInStock: React.Dispatch<React.SetStateAction<boolean>>;
  sortOrder: SortOrder;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
};

const SortFilterControls: React.FC<SortFilterControlsProps> = ({
  limit,
  setLimit,
  sortBy,
  setSortBy,
  inStock,
  setInStock,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <>
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

      <FormControlLabel
        control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} />}
        label="In Stock Only"
      />
    </>
  );
};

export default SortFilterControls;
