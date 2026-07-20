import { useQuery } from '@tanstack/react-query';
import { checklistApi } from '../api/checklist.api';
import { CHECKLIST_KEYS } from '../../../constants/query-keys/checklist';
import type { ChecklistCategoryGroup, ChecklistTask } from '../types/checklist.types';

export const useChecklistTasks = (vesselId: string, date: string, enabled = true) => {
  return useQuery<ChecklistCategoryGroup[]>({
    queryKey: CHECKLIST_KEYS.recordList(vesselId, date),
    queryFn: async () => {
      const response = await checklistApi.getChecklistRecords(vesselId, date);
      
      let rawResult = response.result;
      if (!rawResult) return [];

      let categories: ChecklistCategoryGroup[] = [];

      if (Array.isArray(rawResult)) {
        if (rawResult.length > 0) {
          const firstItem = rawResult[0];
          const isCategoryGroup = firstItem && typeof firstItem === 'object' && 'category' in firstItem && Array.isArray(firstItem.tasks);

          if (isCategoryGroup) {
            categories = rawResult.map((groupObj: any) => {
              return {
                category: {
                  id: groupObj.category?.id || groupObj.category?._id || String(Math.random()),
                  name: groupObj.category?.name || 'General',
                  displayOrder: groupObj.category?.displayOrder || 1,
                },
                tasks: (groupObj.tasks || []).map((taskItem: any): ChecklistTask => {
                  const snapshot = taskItem.task_definition_snapshot || {};
                  return {
                    id: taskItem._id || taskItem.id || String(Math.random()),
                    title: snapshot.title || taskItem.title || 'Unknown Task',
                    description: snapshot.description || taskItem.description || '',
                    displayOrder: taskItem.displayOrder || snapshot.displayOrder || 1,
                    status: taskItem.status ?? 'Pending',
                    taskGroup: taskItem.taskGroup || snapshot.taskGroup || 'Daily',
                    categoryName: groupObj.category?.name || 'General',
                    notes: taskItem.notes,
                    measurement: taskItem.measurement,
                    postponedReason: taskItem.reason || taskItem.postponedReason,
                    hasIssue: !!taskItem.hasIssue,
                  };
                }),
              };
            });
          } else {
            // Flat task record array
            const groupsMap = new Map<string, ChecklistTask[]>();
            const categoryMetaMap = new Map<string, any>();
 
            rawResult.forEach((taskItem: any) => {
              const snapshot = taskItem.task_definition_snapshot || {};
              const categoryName = snapshot.categoryName || taskItem.categoryName || 'General';
              const categoryId = snapshot.categoryId || taskItem.categoryId || 'general';
 
              const task: ChecklistTask = {
                id: taskItem._id || taskItem.id || String(Math.random()),
                title: snapshot.title || taskItem.title || 'Unknown Task',
                description: snapshot.description || taskItem.description || '',
                displayOrder: taskItem.displayOrder || snapshot.displayOrder || 1,
                status: taskItem.status ?? 'Pending',
                taskGroup: taskItem.taskGroup || snapshot.taskGroup || 'Daily',
                categoryName,
                notes: taskItem.notes,
                measurement: taskItem.measurement,
                postponedReason: taskItem.reason || taskItem.postponedReason,
                hasIssue: !!taskItem.hasIssue,
              };

              if (!groupsMap.has(categoryName)) {
                groupsMap.set(categoryName, []);
                categoryMetaMap.set(categoryName, { id: categoryId, name: categoryName, displayOrder: 1 });
              }
              groupsMap.get(categoryName)!.push(task);
            });

            categories = Array.from(groupsMap.entries()).map(([name, tasks]) => {
              const meta = categoryMetaMap.get(name);
              return {
                category: {
                  id: meta.id,
                  name: meta.name,
                  displayOrder: meta.displayOrder,
                },
                tasks: tasks.sort((a, b) => a.displayOrder - b.displayOrder),
              };
            });
          }
        }
      }

      // Sort categories and clean task listings
      return categories.sort((a, b) => a.category.displayOrder - b.category.displayOrder);
    },
    enabled: enabled && !!vesselId && !!date,
  });
};

export default useChecklistTasks;
