import { useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Button } from '../ui/Button';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountManagement = () => {
  const { logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = async () => {
      try {
          const data = await settingsService.exportData();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `account-data-${Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          alert('Failed to export data');
      }
  };

  const handleDelete = async () => {
      if (!confirm('Are you absolutely sure? This action is irreversible and will permanently delete your account and all data.')) return;
      
      try {
          setIsDeleting(true);
          await settingsService.deleteAccount();
          logout();
      } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to delete account');
          setIsDeleting(false);
      }
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2 text-indigo-400" />
            Export Data
        </h3>
        <p className="text-slate-400 mb-4">Download a copy of your personal data, including your profile, items, and activity history.</p>
        <Button variant="outline" onClick={handleExport} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
            Export My Data
        </Button>
      </div>

      <div className="border-t border-slate-800 pt-10">
         <h3 className="text-xl font-semibold text-red-500 mb-4 flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
        </h3>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-start mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3 shrink-0" />
                <div>
                    <h4 className="text-red-400 font-medium mb-1">Delete Account</h4>
                    <p className="text-sm text-red-400/70">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                </div>
            </div>
            <Button variant="outline" onClick={handleDelete} isLoading={isDeleting} className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 w-full justify-center">
                Delete Account
            </Button>
        </div>
      </div>
    </div>
  );
};
