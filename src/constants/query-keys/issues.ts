export const ISSUE_KEYS = {
  all: () => ['issues'] as const,
  list: (vesselId: string) => [...ISSUE_KEYS.all(), 'list', vesselId] as const,
};
