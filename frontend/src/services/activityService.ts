import api from './api';

export interface Activity {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'commented' | 'shared';
    entityType: 'prompt' | 'comment' | 'user';
    entityId: string;
    entityTitle?: string;
    details?: any;
    createdAt: string;
}

export const activityService = {
    getActivities: async (scope: 'me' | 'team' = 'team', page = 1) => {
        const { data } = await api.get('/activity', { params: { scope, page } });
        return data.data; // Assuming standard response wrapper
    }
};
