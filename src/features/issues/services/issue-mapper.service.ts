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
      createdAt: raw.createdAt || '',
    };
  },
};

export default issueMapperService;
