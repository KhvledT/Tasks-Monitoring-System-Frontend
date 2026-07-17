import { useState } from 'react';

export interface UseHistoryFiltersResult {
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const useHistoryFilters = (): UseHistoryFiltersResult => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  return {
    selectedGroup,
    setSelectedGroup,
    selectedStatus,
    setSelectedStatus,
  };
};

export default useHistoryFilters;
