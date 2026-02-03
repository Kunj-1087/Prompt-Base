import api from './api';

export interface DashboardStats {
  totalItems: number;
  activeItems: number;
  recentActivityCount: number;
  completionRate: number;
}

export interface ActivityLog {
  _id: string;
  action: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  activities: ActivityLog[];
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  },
};
