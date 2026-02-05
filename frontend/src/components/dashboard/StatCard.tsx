import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, color = "text-indigo-400" }) => {
  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 p-6 flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && (
            <p className="text-xs text-emerald-400 mt-2 flex items-center">
                {trend}
            </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-slate-800 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  );
};
