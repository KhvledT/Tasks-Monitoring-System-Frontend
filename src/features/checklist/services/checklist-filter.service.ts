import type { ChecklistCategoryGroup } from '../types/checklist.types';

export const checklistFilterService = {
  filterTasksByGroup: (
    categories: ChecklistCategoryGroup[],
    group: string
  ): ChecklistCategoryGroup[] => {
    const normalizedGroup = group.toLowerCase().replace(/[^a-z]/g, '');

    return categories
      .map((groupObj) => {
        const filteredTasks = groupObj.tasks.filter((task) => {
          const taskGroup = (task.taskGroup || '').toLowerCase().replace(/[^a-z]/g, '');
          
          // Map potential group names: e.g. "signing-on", "signingon" -> "signingon"
          if (normalizedGroup === 'signingon') {
            return taskGroup === 'signingon' || taskGroup === 'signing';
          }
          return taskGroup === normalizedGroup;
        });

        return {
          ...groupObj,
          tasks: filteredTasks,
        };
      })
      .filter((groupObj) => groupObj.tasks.length > 0);
  },

  filterTasksBySearch: (
    categories: ChecklistCategoryGroup[],
    query: string
  ): ChecklistCategoryGroup[] => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return categories;

    return categories
      .map((groupObj) => {
        const filteredTasks = groupObj.tasks.filter((task) => {
          const title = (task.title || '').toLowerCase();
          const desc = (task.description || '').toLowerCase();
          return title.includes(trimmed) || desc.includes(trimmed);
        });

        return {
          ...groupObj,
          tasks: filteredTasks,
        };
      })
      .filter((groupObj) => groupObj.tasks.length > 0);
  },
};

export default checklistFilterService;
