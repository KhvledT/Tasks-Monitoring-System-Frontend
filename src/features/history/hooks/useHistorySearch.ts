import { useState } from 'react';

export interface UseHistorySearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useHistorySearch = (): UseHistorySearchResult => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return {
    searchQuery,
    setSearchQuery,
  };
};

export default useHistorySearch;
