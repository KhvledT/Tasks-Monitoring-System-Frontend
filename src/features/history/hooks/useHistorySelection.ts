import { useState, useCallback } from 'react';
import type { HistoryItem } from '../types/history.types';

export interface UseHistorySelectionResult {
  selectedHistoryItem: HistoryItem | null;
  isOpen: boolean;
  open: (item: HistoryItem) => void;
  close: () => void;
}

export const useHistorySelection = (): UseHistorySelectionResult => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const open = useCallback((item: HistoryItem) => {
    setSelectedHistoryItem(item);
  }, []);

  const close = useCallback(() => {
    setSelectedHistoryItem(null);
  }, []);

  return {
    selectedHistoryItem,
    isOpen: selectedHistoryItem !== null,
    open,
    close,
  };
};

export default useHistorySelection;
