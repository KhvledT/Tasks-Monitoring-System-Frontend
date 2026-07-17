import { useState, useCallback } from 'react';

export interface UseHistoryPaginationResult {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  nextPage: (totalPages: number) => void;
  prevPage: () => void;
  reset: () => void;
}

export const useHistoryPagination = (defaultPageSize = 20): UseHistoryPaginationResult => {
  const [page, setPage] = useState<number>(1);

  const nextPage = useCallback((totalPages: number) => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    pageSize: defaultPageSize,
    nextPage,
    prevPage,
    reset,
  };
};

export default useHistoryPagination;
