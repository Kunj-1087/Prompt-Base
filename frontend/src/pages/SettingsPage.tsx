import { useState } from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { TwoFactorSettings } from '../components/settings/TwoFactorSettings';
import { ActiveSessions } from '../components/settings/ActiveSessions';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { AccountManagement } from '../components/settings/AccountManagement';
import { ThemeSettings } from '../components/settings/ThemeSettings';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { User, Lock, Bell, Settings as SettingsIcon, Palette } from 'lucide-react';

export const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account Management', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 text-slate-100 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-slate-400 mb-8">Manage your profile, security preferences, and notification settings.</p>

        <SettingsLayout currentTab={currentTab} onTabChange={setCurrentTab} tabs={tabs}>
            {currentTab === 'profile' && <ProfileSettings />}
            {currentTab === 'appearance' && (
                <div className="space-y-8">
                     <ThemeSettings />
                     <div className="border-t border-slate-800 pt-8">
                         <h3 className="text-lg font-medium text-white mb-4">Language</h3>
                         <div className="flex items-center gap-4">
                            <span className="text-slate-400 text-sm">Select your preferred language:</span>
                            <LanguageSelector />
                         </div>
                     </div>
                </div>
            )}
            {currentTab === 'security' && (
                <div className="space-y-12">
                     <SecuritySettings />
                     <div className="border-t border-slate-800 pt-12">
                        <TwoFactorSettings />
                     </div>
                     <div className="border-t border-slate-800 pt-12">
                        <ActiveSessions />
                     </div>
                </div>
            )}
            {currentTab === 'notifications' && <NotificationSettings />}
            {currentTab === 'account' && <AccountManagement />}
        </SettingsLayout>
      </div>
    </div>
  );
};
