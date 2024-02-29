import { Pagination } from '@mui/material';
import React from 'react';

interface PaginationControlProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  page,
  totalPages,
  onPageChange,
}) => (
  <Pagination
    count={totalPages}
    page={page}
    onChange={(event, value) => onPageChange(value)}
    color="primary"
  />
);

export default PaginationControl;
