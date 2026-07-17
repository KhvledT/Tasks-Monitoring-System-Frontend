import { useState } from 'react';

export interface UseChecklistSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useChecklistSearch = (): UseChecklistSearchResult => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return {
    searchQuery,
    setSearchQuery,
  };
};

export default useChecklistSearch;
