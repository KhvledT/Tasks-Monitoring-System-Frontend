import { useState } from 'react';

export interface UseIssueFiltersResult {
  sortBy: 'date' | 'task';
  setSortBy: (sort: 'date' | 'task') => void;
}

export const useIssueFilters = (): UseIssueFiltersResult => {
  const [sortBy, setSortBy] = useState<'date' | 'task'>('date');

  return {
    sortBy,
    setSortBy,
  };
};

export default useIssueFilters;
