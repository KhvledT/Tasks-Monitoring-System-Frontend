export type IssueImageValue = string;

export interface IssueItem {
  id: string;
  taskRecordId: string;
  taskTitle: string;
  description: string;
  note?: string;
  imageUrl?: IssueImageValue;
  issueDate: string;
  severity?: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION';
  watchSessionId?: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  reporterName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIssueRequest {
  taskRecordId: string;
  description: string;
  note?: string;
  imageUrl?: IssueImageValue;
  issueDate: string;
  severity?: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION';
}

export interface AvailableTaskOption {
  id: string;
  title: string;
  categoryName?: string;
  status: string | number;
}

export interface IssueListResponse {
  statusCode: number;
  message?: string;
  result: any; // Raw issue items array
}
