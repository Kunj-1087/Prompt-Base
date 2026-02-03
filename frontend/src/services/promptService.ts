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

export interface PromptFilters {
  status?: string[];
  priority?: string[];
  tags?: string[];
  date?: {
      start?: string;
      end?: string;
  };
}

export interface SearchResults {
  data: any[];
  meta: {
      facets: {
          status: { label: string; count: number }[];
          priority: { label: string; count: number }[];
          tags: { label: string; count: number }[];
      };
  };
  pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
  };
}

export const searchPromptsAdvanced = async (query: string, filters: PromptFilters, page = 1, limit = 20): Promise<SearchResults> => {
  const params: any = { q: query, page, limit };
  
  if (filters.status?.length) params['filter[status]'] = filters.status.join(',');
  if (filters.priority?.length) params['filter[priority]'] = filters.priority.join(',');
  if (filters.tags?.length) params['filter[tags]'] = filters.tags.join(',');
  
  const { data } = await api.get('/prompts/search', { params });
  return data.data || data; 
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
    const { data } = await api.get('/prompts/suggestions', { params: { q: query } });
    return data.data; 
};

export const getPrompts = async (params: any) => {
    const { data } = await api.get('/prompts', { params });
    return data;
};

export const getPromptById = async (id: string) => {
    const { data } = await api.get(`/prompts/${id}`);
    return data.data || data; // Handle wrapper
};

export const createPrompt = async (promptData: any) => {
    const { data } = await api.post('/prompts', promptData);
    return data;
};

export const updatePrompt = async (id: string, promptData: any) => {
    const { data } = await api.patch(`/prompts/${id}`, promptData);
    return data;
};

export const deletePrompt = async (id: string) => {
    const { data } = await api.delete(`/prompts/${id}`);
    return data;
};

export const restorePrompt = async (id: string) => {
    const { data } = await api.post(`/prompts/${id}/restore`);
    return data;
};

export const promptService = {
    getPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
    restorePrompt,
    searchPromptsAdvanced,
    getSearchSuggestions
};
