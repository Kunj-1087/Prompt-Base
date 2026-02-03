
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-slate-100 dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
        <Icon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="mb-8 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      {action && (
        <div className="flex gap-3">
          {action}
        </div>
      )}
    </div>
  );
};
