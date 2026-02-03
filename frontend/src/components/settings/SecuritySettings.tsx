import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { settingsService } from '../../services/settingsService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lock, Smartphone, Globe } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type PasswordFormInputs = z.infer<typeof passwordSchema>;

export const SecuritySettings = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    const fetchSessions = async () => {
        try {
            const data = await settingsService.getSessions();
            setSessions(data);
        } catch (e) { console.error(e); }
    };
    fetchSessions();
  }, []);

  const onSubmit = async (data: PasswordFormInputs) => {
    try {
      await settingsService.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
      });
      alert('Password updated successfully');
      reset();
    } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-indigo-400" />
            Change Password
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <Input 
            label="Current Password" 
            type="password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input 
            label="New Password" 
            type="password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input 
            label="Confirm New Password" 
            type="password"
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword')}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>

      <div className="border-t border-slate-800 pt-8">
         <h3 className="text-xl font-semibold text-white mb-6">Active Sessions</h3>
         <div className="space-y-4">
             {sessions.map((session, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                     <div className="flex items-center">
                         <div className="bg-slate-700 p-2 rounded mr-4">
                            {session.device.toLowerCase().includes('mobile') ? <Smartphone className="w-5 h-5 text-slate-400" /> : <Globe className="w-5 h-5 text-slate-400" />}
                         </div>
                         <div>
                             <p className="text-sm font-medium text-slate-200">{session.device}</p>
                             <p className="text-xs text-slate-500">
                                 {session.ip} • {session.isCurrent ? <span className="text-emerald-400">Current Session</span> : new Date(session.lastActive).toLocaleDateString()}
                             </p>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};
