export const HISTORY_KEYS = {
  all: () => ['history'] as const,
  list: (vesselId: string, filters: Record<string, any>, page: number) => 
    [...HISTORY_KEYS.all(), 'list', vesselId, { ...filters }, page] as const,
};
