import type { HistoryItem, HistoryPagination } from '../types/history.types';

export const historyMapperService = {
  mapToHistoryItem: (raw: any): HistoryItem => {
    const snapshot = raw.task_definition_snapshot || raw.taskRecord?.task_definition_snapshot || {};
    return {
      id: raw._id || raw.id || String(Math.random()),
      taskRecordId: raw.taskRecordId || raw.task_record_id || '',
      title: snapshot.title || raw.title || raw.taskRecord?.task_definition_snapshot?.title || 'Vessel Log Entry',
      categoryName: snapshot.categoryName || raw.categoryName || raw.taskRecord?.task_definition_snapshot?.categoryName || 'General',
      status: raw.status || 'Completed',
      completedBy: {
        fullName: raw.completedBy?.fullName || raw.completedBy?.name || 'Officer',
        rank: raw.completedBy?.rank || 'Crew',
      },
      notes: raw.notes || raw.note || '',
      measurement: raw.measurement || '',
      postponedReason: raw.reason || raw.postponedReason || '',
      taskGroup: snapshot.taskGroup || raw.taskGroup || 'Daily',
      issueDate: raw.issueDate || raw.issue_date || raw.createdAt || new Date().toISOString(),
      createdAt: raw.createdAt || '',
    };
  },

  mapToPaginatedHistory: (response: any): HistoryPagination => {
    const rawResult = response?.result || {};
    
    // Check if result is already formatted as docs array or paginated structure
    const items = Array.isArray(rawResult.docs)
      ? rawResult.docs.map(historyMapperService.mapToHistoryItem)
      : Array.isArray(rawResult)
      ? rawResult.map(historyMapperService.mapToHistoryItem)
      : [];

    return {
      items,
      totalItems: typeof rawResult.totalDocs === 'number' ? rawResult.totalDocs : items.length,
      limit: typeof rawResult.limit === 'number' ? rawResult.limit : 20,
      totalPages: typeof rawResult.totalPages === 'number' ? rawResult.totalPages : 1,
      page: typeof rawResult.page === 'number' ? rawResult.page : 1,
    };
  },
};

export default historyMapperService;
