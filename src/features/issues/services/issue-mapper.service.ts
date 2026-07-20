import type { IssueItem } from '../types/issue.types';

export const issueMapperService = {
  mapToIssueItem: (raw: any): IssueItem => {
    return {
      id: raw._id || raw.id || String(Math.random()),
      taskRecordId: raw.taskRecordId || raw.task_record_id || '',
      taskTitle:
        raw.taskTitle ||
        raw.task_title ||
        raw.taskRecord?.task_definition_snapshot?.title ||
        'Vessel Equipment Defect',
      description: raw.description || '',
      note: raw.note || raw.extraNote || '',
      imageUrl: raw.imageUrl || raw.image_url || raw.imageReference || '',
      issueDate: raw.issueDate || raw.issue_date || raw.createdAt || new Date().toISOString(),
      severity: raw.severity || 'MINOR',
      watchSessionId: raw.watchSessionId || raw.watch_session_id || null,
      status: raw.status || 'OPEN',
      resolutionNotes: raw.resolutionNotes || null,
      resolvedAt: raw.resolvedAt || null,
      reporterName: raw.userId?.fullName || raw.userId?.name || 'Officer',
      createdAt: raw.createdAt || '',
      updatedAt: raw.updatedAt || '',
    };
  },
};

export default issueMapperService;
