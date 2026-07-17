export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  status: 'Pending' | 'Completed' | 'Postponed' | string | number;
  taskGroup: string;
  categoryName?: string;
  notes?: string;
  measurement?: string;
  postponedReason?: string;
}

export interface ChecklistCategoryGroup {
  category: {
    id: string;
    name: string;
    displayOrder: number;
  };
  tasks: ChecklistTask[];
}

export interface CompleteTaskRequest {
  notes?: string;
  measurement?: string;
}

export interface PostponeTaskRequest {
  reason: string;
}

export interface ChecklistListResponse {
  statusCode: number;
  message?: string;
  result: any; // Can be array of category groups or flat logs
}
