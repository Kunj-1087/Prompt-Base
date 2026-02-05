import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import type { IUserProfile, IUser } from '../../types/user';

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
  }),
  dateOfBirth: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 13;
  }, 'You must be at least 13 years old'),
  socialLinks: z.object({
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: IUser;
  profile: IUserProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  profile,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      location: {
        city: profile?.location?.city || '',
        country: profile?.location?.country || '',
      },
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      socialLinks: {
        twitter: profile?.socialLinks?.twitter || '',
        linkedin: profile?.socialLinks?.linkedin || '',
        github: profile?.socialLinks?.github || '',
        website: profile?.socialLinks?.website || '',
      },
    },
  });

  // Re-populate form if user/profile props change significantly
  useEffect(() => {
    reset({
        name: user.name || '',
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        location: {
          city: profile?.location?.city || '',
          country: profile?.location?.country || '',
        },
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        socialLinks: {
          twitter: profile?.socialLinks?.twitter || '',
          linkedin: profile?.socialLinks?.linkedin || '',
          github: profile?.socialLinks?.github || '',
          website: profile?.socialLinks?.website || '',
        },
      });
  }, [profile, user, reset]);

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Phone"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1234567890"
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium leading-none text-slate-300">Bio</label>
          <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.bio ? 'border-red-500' : ''}`}
            {...register('bio')}
            placeholder="Tell us about yourself..."
          />
          {errors.bio && <span className="text-xs text-red-400">{errors.bio.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Input
            label="City"
            {...register('location.city')}
            error={errors.location?.city?.message}
          />
           <Input
            label="Country"
            {...register('location.country')}
            error={errors.location?.country?.message}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GitHub"
            placeholder="https://github.com/username"
            {...register('socialLinks.github')}
            error={errors.socialLinks?.github?.message}
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/in/username"
            {...register('socialLinks.linkedin')}
            error={errors.socialLinks?.linkedin?.message}
          />
          <Input
            label="Twitter / X"
            placeholder="https://x.com/username"
            {...register('socialLinks.twitter')}
            error={errors.socialLinks?.twitter?.message}
          />
          <Input
            label="Website"
            placeholder="https://example.com"
            {...register('socialLinks.website')}
            error={errors.socialLinks?.website?.message}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
