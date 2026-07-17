export const CHECKLIST_KEYS = {
  all: () => ['checklists'] as const,
  tasks: (vesselId: string) => [...CHECKLIST_KEYS.all(), 'tasks', vesselId] as const,
  taskList: (vesselId: string, taskGroup?: string) => 
    [...CHECKLIST_KEYS.tasks(vesselId), taskGroup || 'all'] as const,
  records: (vesselId: string) => [...CHECKLIST_KEYS.all(), 'records', vesselId] as const,
  recordList: (vesselId: string, date: string) => 
    [...CHECKLIST_KEYS.records(vesselId), date] as const,
};
