import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary } from '../services/dashboardService';
import { authService } from '../services/authService';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Layers, Zap, Clock, TrendingUp, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await dashboardService.getSummary();
                setSummary(data);
            } catch (error) {
                console.error('Failed to load dashboard', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };
    
    const handleResendVerification = async () => {
        try {
            await authService.resendVerification();
            alert('Verification email sent! Please check your inbox.');
        } catch (error: any) {
             // 429 is the rate limit error code usually
             if (error.response?.status === 429) {
                 alert('Please wait a minute before requesting another email.');
             } else {
                 alert(error.response?.data?.message || 'Failed to resend verification email.');
             }
        }
    };

    if (isLoading) {
         return (
            <div className="min-h-screen pt-24 px-4 bg-slate-950 flex justify-center">
                <div className="text-indigo-500 animate-pulse">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-950 text-slate-100 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Verification Banner */}
                {user && !user.emailVerified && (
                    <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center text-amber-500">
                             <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                             <p className="font-medium">Your email address is not verified. Please verify to access all features.</p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                            onClick={handleResendVerification}
                        >
                            Resend Verification
                        </Button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                         <h1 className="text-3xl font-bold text-white mb-2">
                            {getGreeting()}, <span className="text-indigo-400">{user?.name}</span>
                         </h1>
                         <p className="text-slate-400">Here's what's happening today.</p>
                         <button onClick={() => navigate('/prompts')} className="text-sm text-indigo-400 hover:text-indigo-300 mt-1">View All Prompts</button>
                    </div>
                    <Button 
                        className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 shadow-lg shadow-indigo-500/20"
                        onClick={() => window.location.href = '/prompts/new'} 
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Prompt
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        icon={Layers} 
                        label="Total Items" 
                        value={summary?.stats.totalItems || 0} 
                        color="text-blue-400"
                    />
                    <StatCard 
                        icon={Zap} 
                        label="Active Items" 
                        value={summary?.stats.activeItems || 0} 
                        color="text-yellow-400"
                    />
                    <StatCard 
                        icon={Clock} 
                        label="Recent Activity" 
                        value={summary?.stats.recentActivityCount || 0} 
                        trend="Last 24h"
                        color="text-purple-400"
                    />
                    <StatCard 
                        icon={TrendingUp} 
                        label="Completion Rate" 
                        value={`${summary?.stats.completionRate || 0}%`} 
                        color="text-emerald-400"
                    />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed (2 Cols) */}
                    <div className="lg:col-span-2">
                        <ActivityFeed activities={summary?.activities || []} />
                    </div>

                    {/* Quick Actions / Sidebar (1 Col) */}
                    <div className="space-y-6">
                        {/* Could add a 'Quick Actions' card here or 'System Status' */}
                         <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 text-slate-300">
                                    Edit Profile
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 text-slate-300">
                                    View Documentation
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-slate-700 hover:bg-slate-800 text-slate-300">
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
