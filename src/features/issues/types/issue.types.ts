export type IssueImageValue = string;

export interface IssueItem {
  id: string;
  taskRecordId: string;
  taskTitle: string;
  description: string;
  note?: string;
  imageUrl?: IssueImageValue;
  issueDate: string;
  createdAt?: string;
}

export interface CreateIssueRequest {
  taskRecordId: string;
  description: string;
  note?: string;
  imageUrl?: IssueImageValue;
  issueDate: string;
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
