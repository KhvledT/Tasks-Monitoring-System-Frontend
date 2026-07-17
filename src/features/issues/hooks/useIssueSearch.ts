import { useState } from 'react';

export interface UseIssueSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useIssueSearch = (): UseIssueSearchResult => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return {
    searchQuery,
    setSearchQuery,
  };
};

export default useIssueSearch;
