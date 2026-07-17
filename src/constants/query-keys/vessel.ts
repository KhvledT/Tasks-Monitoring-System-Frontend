export const VESSEL_KEYS = {
  all: () => ['vessels'] as const,
  list: () => [...VESSEL_KEYS.all(), 'list'] as const,
};
