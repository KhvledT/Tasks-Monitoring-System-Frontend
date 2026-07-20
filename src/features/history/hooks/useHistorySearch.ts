import { useState, useEffect } from 'react';

export interface UseHistorySearchResult {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useHistorySearch = (delay = 400): UseHistorySearchResult => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
  };
};

export default useHistorySearch;
