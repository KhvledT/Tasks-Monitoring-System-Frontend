import type { HistoryItem } from '../types/history.types';

export const historyFilterService = {
  filterHistory: (
    items: HistoryItem[],
    query: string,
    status: string,
    group: string
  ): HistoryItem[] => {
    const trimmedQuery = query.trim().toLowerCase();
    const normalizedStatus = status.toLowerCase();
    const normalizedGroup = group.toLowerCase().replace(/[^a-z]/g, ''); // "SigningOn" -> "signingon"

    return items.filter((item) => {
      // 1. Text Search matching title, description, category, or note
      if (trimmedQuery) {
        const title = (item.title || '').toLowerCase();
        const category = (item.categoryName || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();
        if (!title.includes(trimmedQuery) && !category.includes(trimmedQuery) && !notes.includes(trimmedQuery)) {
          return false;
        }
      }

      // 2. Status matching (Completed, Postponed, etc.)
      if (normalizedStatus && normalizedStatus !== 'all') {
        const itemStatus = (item.status || '').toLowerCase();
        if (itemStatus !== normalizedStatus) {
          return false;
        }
      }

      // 3. Task Group matching (Daily, Weekly, Monthly, SigningOn)
      if (normalizedGroup && normalizedGroup !== 'all') {
        const itemGroup = (item.taskGroup || '').toLowerCase().replace(/[^a-z]/g, '');
        if (normalizedGroup === 'signingon') {
          if (itemGroup !== 'signingon' && itemGroup !== 'signing') {
            return false;
          }
        } else if (itemGroup !== normalizedGroup) {
          return false;
        }
      }

      return true;
    });
  },
};

export default historyFilterService;
