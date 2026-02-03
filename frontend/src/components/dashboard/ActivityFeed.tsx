import type { ActivityLog } from '../../services/dashboardService';
import { Card } from '../ui/Card';
import { Clock, Activity } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 p-8 text-center">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-slate-300 font-medium">No recent activity</h3>
            <p className="text-slate-500 text-sm">Your actions will appear here once you start using the app.</p>
        </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-400" />
          Recent Activity
      </h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity._id} className="relative pl-6 border-l-2 border-slate-800 last:border-0 pb-1">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500/50"></div>
             <div className="flex justify-between items-start">
                <div>
                     <p className="text-slate-200 font-medium">{activity.action}</p>
                     {activity.metadata && (
                         <p className="text-sm text-slate-500 mt-1">
                             {JSON.stringify(activity.metadata)}
                         </p>
                     )}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {new Date(activity.createdAt).toLocaleDateString()}
                </span>
             </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
