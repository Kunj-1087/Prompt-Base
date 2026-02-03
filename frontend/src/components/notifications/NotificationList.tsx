import { Bell } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../ui/button';

// Mock Notification Interface
interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

interface NotificationListProps {
    notifications?: Notification[];
}

export const NotificationList = ({ notifications = [] }: NotificationListProps) => {
    if (notifications.length === 0) {
        return (
            <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up! Check back later for updates."
                action={
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh
                    </Button>
                }
            />
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                    <h4 className="font-medium text-slate-200">{notification.title}</h4>
                    <p className="text-sm text-slate-400">{notification.message}</p>
                    <span className="text-xs text-slate-500 mt-2 block">{notification.date}</span>
                </div>
            ))}
        </div>
    );
};
