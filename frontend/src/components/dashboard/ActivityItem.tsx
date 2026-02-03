import React from 'react'; // React imported for JSX
import { formatDistanceToNow } from 'date-fns';
import type { Activity } from '../../services/activityService';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlusCircle, Edit2, Trash2, CheckCircle, MessageSquare, Share2 } from 'lucide-react';

interface ActivityItemProps {
    activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    const getIcon = () => {
        switch (activity.action) {
            case 'created': return <PlusCircle className="w-4 h-4 text-green-500" aria-hidden="true" />;
            case 'updated': return <Edit2 className="w-4 h-4 text-blue-500" aria-hidden="true" />;
            case 'deleted': return <Trash2 className="w-4 h-4 text-red-500" aria-hidden="true" />;
            case 'status_changed': return <CheckCircle className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
            case 'commented': return <MessageSquare className="w-4 h-4 text-purple-500" aria-hidden="true" />;
            case 'shared': return <Share2 className="w-4 h-4 text-indigo-500" aria-hidden="true" />;
            default: return <div className="w-2 h-2 rounded-full bg-slate-500" aria-hidden="true" />;
        }
    };

    const getActionText = () => {
        switch (activity.action) {
             case 'created': return `created ${activity.entityType}`;
             case 'updated': return `updated ${activity.entityType}`;
             case 'deleted': return `deleted ${activity.entityType}`;
             case 'status_changed': return `changed status of ${activity.entityType}`;
             case 'commented': return `commented on ${activity.entityType}`;
             case 'shared': return `shared ${activity.entityType}`;
             default: return activity.action;
        }
    };

    return (
        <div className="flex gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition-colors border border-slate-700/50">
            <Avatar className="w-10 h-10 border border-slate-700">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{activity.user.name}</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                        {getIcon()}
                        {getActionText()}
                    </span>
                    {activity.entityTitle && (
                        <span className="font-medium text-indigo-400 text-sm truncate">
                             "{activity.entityTitle}"
                        </span>
                    )}
                </div>
                {/* Details/Diff could go here */}
                <div className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </div>
            </div>
        </div>
    );
};
