export const DASHBOARD_KEYS = {
  all: () => ['dashboard'] as const,
  metrics: (vesselId: string) => [...DASHBOARD_KEYS.all(), 'metrics', vesselId] as const,
};
