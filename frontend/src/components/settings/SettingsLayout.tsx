import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsLayoutProps {
  currentTab: string;
  onTabChange: (id: string) => void;
  tabs: Tab[];
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ currentTab, onTabChange, tabs, children }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={'ghost'}
                className={`w-full justify-start ${
                  currentTab === tab.id 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className={`w-4 h-4 mr-3 ${currentTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
};
