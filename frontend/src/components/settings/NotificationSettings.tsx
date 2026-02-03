import { useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Button } from '../ui/Button';
import { Bell, Mail, Smartphone } from 'lucide-react';

export const NotificationSettings = () => {
  // We'd ideally fetch these from user profile via context or API.
  // Assuming defaults or using local state for MVP demo.
  const [prefs, setPrefs] = useState({
      email: true,
      push: false,
      frequency: 'daily'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: 'email' | 'push') => {
      setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);
        await settingsService.updateNotifications(prefs as any);
        alert('Notification preferences saved');
    } catch (error) {
        alert('Failed to save preferences');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-indigo-400" />
            Notification Preferences
        </h3>
        <p className="text-slate-400 mb-6">Choose how and when you want to be notified.</p>
        
        <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <div className="flex items-center">
                    <Mail className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-slate-200">Email Notifications</p>
                        <p className="text-xs text-slate-500">Receive updates and newsletters via email.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={prefs.email} onChange={() => handleToggle('email')} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-slate-200">Push Notifications</p>
                        <p className="text-xs text-slate-500">Receive real-time alerts on your device.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={prefs.push} onChange={() => handleToggle('push')} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>
        </div>
      </div>
        
      <Button onClick={handleSave} isLoading={isSaving}>
        Save Changes
      </Button>
    </div>
  );
};
