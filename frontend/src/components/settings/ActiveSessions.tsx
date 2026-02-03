import { useState, useEffect } from 'react';
import { sessionService, type ISession } from '../../services/sessionService';
import { Button } from '../ui/Button';
import { Laptop, Smartphone, Globe, Clock, Trash2, LogOut } from 'lucide-react';

// Helper for relative time to avoid date-fns dependency
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
};

export const ActiveSessions = () => {
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const res = await sessionService.getSessions();
            setSessions(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id: string) => {
        try {
            await sessionService.revokeSession(id);
            setSessions(sessions.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to revoke session');
        }
    };

    const handleRevokeAll = async () => {
        if (!confirm('Are you sure you want to log out of all other devices?')) return;
        try {
            await sessionService.revokeAllSessions();
            setSessions(sessions.filter(s => s.isCurrent));
        } catch (error) {
            console.error('Failed to revoke sessions');
        }
    };

    if (isLoading) return <div className="text-slate-400">Loading sessions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-white flex items-center mb-1">
                        <Globe className="w-5 h-5 mr-2 text-indigo-400" />
                        Active Sessions
                    </h3>
                    <p className="text-slate-400 text-sm">Manage your active sessions on other devices.</p>
                </div>
                {sessions.length > 1 && (
                    <Button variant="danger" size="sm" onClick={handleRevokeAll}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out All Devices
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <div 
                        key={session.id} 
                        className={`
                            border rounded-lg p-4 flex items-center justify-between
                            ${session.isCurrent 
                                ? 'bg-indigo-500/10 border-indigo-500/30' 
                                : 'bg-slate-800/50 border-slate-700'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${session.isCurrent ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'}`}>
                                {session.device?.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Laptop size={20} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">
                                        {session.device}
                                    </span>
                                    {session.isCurrent && (
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500 text-white font-bold tracking-wide uppercase">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-400 flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
                                    <span>{session.browser} on {session.os}</span>
                                    <span className="flex items-center">
                                        <Globe size={12} className="mr-1" />
                                        {session.location}
                                    </span>
                                    <span className="flex items-center" title={new Date(session.lastActivity).toLocaleString()}>
                                        <Clock size={12} className="mr-1" />
                                        Active {formatRelativeTime(session.lastActivity)} ago
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!session.isCurrent && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                                onClick={() => handleRevoke(session.id)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
