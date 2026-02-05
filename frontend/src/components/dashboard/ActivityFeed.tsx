import React, { useEffect, useState } from 'react';
import { activityService, type Activity } from '../../services/activityService';
import { ActivityItem } from './ActivityItem';
import { useSocket } from '../../context/SocketContext';
import { Button } from '../ui/Button';

interface ActivityFeedProps {
    initialActivities?: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ initialActivities = [] }) => {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { socket } = useSocket();

    useEffect(() => {
        // If no initial activities or we want to ensure fresh data?
        // Let's fetch if empty.
        if (initialActivities.length === 0) {
            loadActivities(1);
        } else {
            setActivities(initialActivities);
        }
    }, [initialActivities]);

    useEffect(() => {
        if (!socket) return;
        
        socket.on('new_activity', (newActivity: Activity) => {
            setActivities(prev => [newActivity, ...prev]);
        });

        return () => {
            socket.off('new_activity');
        };
    }, [socket]);

    const loadActivities = async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await activityService.getActivities('team', pageNum);
            if (pageNum === 1) {
                setActivities(data);
            } else {
                setActivities(prev => [...prev, ...data]);
            }
            if (data.length < 20) setHasMore(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadActivities(nextPage);
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Feed</h3>
            <div className="space-y-4 mb-4">
                {activities.length === 0 && !loading ? (
                    <p className="text-slate-500 text-center py-4">No recent activity</p>
                ) : (
                    activities.map((activity) => (
                        <ActivityItem key={activity._id} activity={activity} />
                    ))
                )}
            </div>
            {hasMore && (
                <Button 
                    variant="ghost" 
                    className="w-full text-slate-400 hover:text-white"
                    onClick={handleLoadMore}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </div>
    );
};
