import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Camera } from 'lucide-react';
import api from '../../services/api';

interface ProfileFormInputs {
  name: string;
  bio: string;
  phone: string;
  location: {
      city: string;
      country: string;
  };
  socialLinks: {
      twitter: string;
      github: string;
      linkedin: string;
  };
}

export const ProfileSettings = () => {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<ProfileFormInputs>();

  useEffect(() => {
     if (user) {
         setValue('name', user.name);
         // Ideally fetch full profile here if 'user' context is lightweight
         // For now assuming we might fetch profile data separately or it's in user object (it's likely not all in user object based on previous steps)
         // We will fetch profile data on mount
         fetchProfile();
     }
  }, [user, setValue]);

  const fetchProfile = async () => {
      try {
          const res = await api.get('/users/me/profile');
          const profile = res.data.data;
          // Populate form
          setValue('bio', profile.bio);
          setValue('phone', profile.phone);
          if (profile.location) {
            setValue('location.city', profile.location.city);
            setValue('location.country', profile.location.country);
          }
          if (profile.socialLinks) {
              setValue('socialLinks.twitter', profile.socialLinks.twitter || '');
              setValue('socialLinks.github', profile.socialLinks.github || '');
              setValue('socialLinks.linkedin', profile.socialLinks.linkedin || '');
          }
      } catch (e) {
          console.error(e);
      }
  };

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      setIsLoading(true);
      await api.patch('/settings/profile', data);
      alert('Profile updated successfully');
      // context update might be needed if name changed
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-400" />
            Profile Information
        </h3>
        
        {/* Avatar Placeholder */}
        <div className="flex items-center mb-8">
            <div className="relative group cursor-pointer mr-6">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-bold border-2 border-indigo-500/50 overflow-hidden">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-white">Profile Picture</p>
                <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Display Name" {...register('name')} />
            <Input label="Phone Number" {...register('phone')} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Bio</label>
            <textarea 
                {...register('bio')}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                placeholder="Tell us a bit about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="City" {...register('location.city')} />
            <Input label="Country" {...register('location.country')} />
          </div>

          <div className="border-t border-slate-800 pt-6">
              <h4 className="text-sm font-medium text-slate-300 mb-4">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Twitter" placeholder="@username" {...register('socialLinks.twitter')} />
                <Input label="GitHub" placeholder="username" {...register('socialLinks.github')} />
                <Input label="LinkedIn" placeholder="username" {...register('socialLinks.linkedin')} />
              </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
