import { apiClient } from '../../../lib/axios';

export interface Template {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  vesselType?: string;
  rank?: string;
  scope: 'GLOBAL' | 'VESSEL';
  vesselId?: string;
  isActive: boolean;
  deletedAt?: string;
}

export interface TemplateVersion {
  _id: string;
  templateId: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED';
  description?: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface TemplateAssignment {
  _id: string;
  templateId: string;
  templateVersionId: string;
  rank: string;
  vesselType: string;
  isDefault: boolean;
}

export interface TaskCategory {
  _id: string;
  id?: string;
  templateId: string;
  taskGroup: string;
  name: string;
  displayOrder: number;
}

export interface TaskDefinition {
  _id: string;
  categoryId: string;
  title: string;
  description?: string;
  displayOrder: number;
  isCustom: boolean;
}

export interface TemplateMetaOptions {
  taskGroups: string[];
  ranks: string[];
  scopes: string[];
  vesselTypes: string[];
  measurementUnits: string[];
  frequencies: string[];
  severities: string[];
}

export const templatesApi = {
  getMetaOptions: async (): Promise<TemplateMetaOptions> => {
    const response = await apiClient.get<{ success: boolean; result: TemplateMetaOptions }>(
      '/template/meta-options'
    );
    return response.data.result;
  },

  listTemplates: async (params?: any): Promise<Template[]> => {
    const response = await apiClient.get<{ success: boolean; result: { items: Template[] } | Template[] }>(
      '/admin/templates',
      { params }
    );
    const res = response.data.result;
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).items)) return (res as any).items;
    return [];
  },

  getTemplateDetails: async (
    id: string
  ): Promise<{ template: Template; categories: TaskCategory[]; definitions: TaskDefinition[]; tasks?: TaskDefinition[] }> => {
    const response = await apiClient.get<{
      success: boolean;
      result: { template: Template; categories: TaskCategory[]; definitions: TaskDefinition[]; tasks?: TaskDefinition[] };
    }>(`/admin/templates/${id}`);
    return response.data.result;
  },

  createTemplate: async (data: {
    name: string;
    description?: string;
    scope: 'GLOBAL' | 'VESSEL';
    vesselId?: string;
  }): Promise<Template> => {
    const response = await apiClient.post<{ success: boolean; result: Template }>(
      '/admin/templates',
      data
    );
    return response.data.result;
  },

  updateTemplate: async (id: string, data: { name: string; description?: string }): Promise<Template> => {
    const response = await apiClient.patch<{ success: boolean; result: Template }>(
      `/admin/templates/${id}`,
      data
    );
    return response.data.result;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/templates/${id}`);
  },

  restoreTemplate: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/templates/${id}/restore`);
  },

  inheritGlobalTemplate: async (globalTemplateId: string): Promise<Template> => {
    const response = await apiClient.post<{ success: boolean; result: Template }>(
      `/admin/templates/inherit/${globalTemplateId}`
    );
    return response.data.result;
  },

  // Categories
  createCategory: async (data: {
    templateId: string;
    name: string;
    taskGroup: string;
    displayOrder: number;
  }): Promise<TaskCategory> => {
    const { templateId, ...body } = data;
    const response = await apiClient.post<{ success: boolean; result: TaskCategory }>(
      `/admin/templates/${templateId}/categories`,
      body
    );
    return response.data.result;
  },

  updateCategory: async (
    templateId: string,
    catId: string,
    data: { name: string; displayOrder: number }
  ): Promise<TaskCategory> => {
    const response = await apiClient.patch<{ success: boolean; result: TaskCategory }>(
      `/admin/templates/${templateId}/categories/${catId}`,
      data
    );
    return response.data.result;
  },

  deleteCategory: async (templateId: string, catId: string): Promise<void> => {
    await apiClient.delete(`/admin/templates/${templateId}/categories/${catId}`);
  },

  // Definitions
  createDefinition: async (
    templateId: string,
    data: {
      categoryId: string;
      title: string;
      description?: string;
      displayOrder: number;
    }
  ): Promise<TaskDefinition> => {
    const response = await apiClient.post<{ success: boolean; result: TaskDefinition }>(
      `/admin/templates/${templateId}/tasks`,
      data
    );
    return response.data.result;
  },

  updateDefinition: async (
    templateId: string,
    defId: string,
    data: { title: string; description?: string; displayOrder: number }
  ): Promise<TaskDefinition> => {
    const response = await apiClient.patch<{ success: boolean; result: TaskDefinition }>(
      `/admin/templates/${templateId}/tasks/${defId}`,
      data
    );
    return response.data.result;
  },

  deleteDefinition: async (templateId: string, defId: string): Promise<void> => {
    await apiClient.delete(`/admin/templates/${templateId}/tasks/${defId}`);
  },

  // Versions
  listVersions: async (templateId: string): Promise<TemplateVersion[]> => {
    const response = await apiClient.get<{ success: boolean; result: TemplateVersion[] }>(
      `/admin/template-versions/templates/${templateId}/versions`
    );
    return response.data.result;
  },

  createVersion: async (data: {
    templateId: string;
    version: string;
    description?: string;
    isCurrent?: boolean;
  }): Promise<TemplateVersion> => {
    const response = await apiClient.post<{ success: boolean; result: TemplateVersion }>(
      '/admin/template-versions',
      data
    );
    return response.data.result;
  },

  publishVersion: async (versionId: string): Promise<void> => {
    await apiClient.patch(`/admin/template-versions/${versionId}/publish`);
  },

  compareVersions: async (versionAId: string, versionBId: string): Promise<any> => {
    const response = await apiClient.get<{ success: boolean; result: any }>(
      '/admin/template-versions/compare',
      { params: { versionA: versionAId, versionB: versionBId } }
    );
    return response.data.result;
  },

  // Assignments
  listAssignments: async (): Promise<TemplateAssignment[]> => {
    const response = await apiClient.get<{ success: boolean; result: { items: TemplateAssignment[] } | TemplateAssignment[] }>(
      '/admin/template-versions/assignments'
    );
    const res = response.data.result;
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).items)) return (res as any).items;
    return [];
  },

  createAssignment: async (data: {
    templateId: string;
    templateVersionId: string;
    rank: string;
    vesselType: string;
    isDefault?: boolean;
  }): Promise<TemplateAssignment> => {
    const response = await apiClient.post<{ success: boolean; result: TemplateAssignment }>(
      '/admin/template-versions/assignments',
      data
    );
    return response.data.result;
  },

  deleteAssignment: async (assignmentId: string): Promise<void> => {
    await apiClient.delete(`/admin/template-versions/assignments/${assignmentId}`);
  },
};
