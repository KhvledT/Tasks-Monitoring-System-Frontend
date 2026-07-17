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
