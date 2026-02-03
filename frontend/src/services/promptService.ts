import api from './api';

export interface IPrompt {
    _id: string;
    title: string;
    description?: string;
    status: 'draft' | 'active' | 'completed' | 'archived';
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePromptData {
    title: string;
    description?: string;
    status?: 'draft' | 'active' | 'completed' | 'archived';
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface UpdatePromptData {
    title?: string;
    description?: string;
    status?: 'draft' | 'active' | 'completed' | 'archived';
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface GetPromptsResponse {
    data: IPrompt[];
    pagination: PaginationMeta;
}

export const promptService = {
  getPrompts: async (params?: { 
      status?: string; 
      priority?: string; 
      search?: string; 
      page?: number; 
      limit?: number; 
      sort?: string;
      order?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const response = await api.get(`/prompts?${queryParams.toString()}`);
    // Backend wraps response in { success: true, message: "...", data: { data: [...], pagination: {...} } }
    // Ideally we return the inner data object
    return response.data.data as GetPromptsResponse;
  },

  getPromptById: async (id: string) => {
    const response = await api.get(`/prompts/${id}`);
    return response.data.data as IPrompt;
  },

  createPrompt: async (data: CreatePromptData) => {
    const response = await api.post('/prompts', data);
    return response.data;
  },

  updatePrompt: async (id: string, data: UpdatePromptData) => {
    const response = await api.patch(`/prompts/${id}`, data);
    return response.data;
  },

  deletePrompt: async (id: string) => {
    const response = await api.delete(`/prompts/${id}`);
    return response.data;
  },

  restorePrompt: async (id: string) => {
    const response = await api.post(`/prompts/${id}/restore`);
    return response.data;
  },

  searchPrompts: async (params: { q: string; page?: number; limit?: number; status?: string; priority?: string; sort?: string; order?: string }) => {
    const response = await api.get('/prompts/search', { params });
    return response.data;
  },

  getSuggestions: async (q: string) => {
    const response = await api.get('/prompts/suggestions', { params: { q } });
    return response.data;
  }
};
