import { useState } from "react";

interface UsePaginationOptions {
  defaultPageNum?: number;
  defaultPageSize?: number;
}

export function usePagination({
  defaultPageNum = 1,
  defaultPageSize = 10,
}: UsePaginationOptions = {}) {
  const [pageNum, setPageNum] = useState(defaultPageNum);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const resetPage = () => {
    setPageNum(1);
  };

  const handlePageChange = (page: number) => {
    setPageNum(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNum(1);
  };

  return {
    pagination: {
      pageNum,
      pageSize,
    },
    resetPage,
    handlePageChange,
    handlePageSizeChange,
  };
}
