export interface HistoryItem {
  id: string;
  taskRecordId: string;
  title: string;
  categoryName: string;
  status: 'Completed' | 'Postponed' | string;
  completedBy: {
    fullName: string;
    rank?: string;
  };
  notes?: string;
  measurement?: string;
  postponedReason?: string;
  taskGroup: string;
  issueDate: string;
  createdAt?: string;
  hasIssue?: boolean;
  issue?: {
    id?: string;
    description: string;
    severity: string;
    status: string;
    imageUrl?: string | null;
    note?: string | null;
    issueDate?: string;
    resolvedAt?: string | null;
  } | null;
}

export interface HistoryPagination {
  items: HistoryItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface HistoryListResponse {
  statusCode: number;
  message?: string;
  result: any; // Raw paginated DTO
}
