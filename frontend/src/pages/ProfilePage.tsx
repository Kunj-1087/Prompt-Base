import { useEffect, useState } from 'react';
import { Edit2, MapPin, Calendar, Globe, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AvatarUpload } from '../components/profile/AvatarUpload';
import { EditProfileForm } from '../components/profile/EditProfileForm';
import { userService } from '../services/userService';
import type { IUser, IUserProfile } from '../types/user';

export const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getProfile();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data: any) => {
    try {
      const updated = await userService.updateProfile(data);
      setUser(updated.user);
      setProfile(updated.profile);
      setIsEditing(false);
      // Ideally show toast success here
      alert('Profile updated successfully!'); 
    } catch (err) {
        console.error(err);
        alert('Failed to update profile');
        throw err; // Re-throw for form to catch
    }
  };

  const handleUpdateAvatar = async (newUrl: string) => {
    try {
      const updated = await userService.updateAvatar(newUrl);
      setProfile(updated.profile);
      alert('Avatar updated successfully!');
    } catch (err) {
       console.error(err);
       alert('Failed to update avatar');
       throw err; 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-950">
        <div className="text-indigo-500 animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-red-400 mb-4">{error || 'User not found'}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 text-slate-100 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 md:p-8 bg-slate-900/50 backdrop-blur border-slate-800">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="shrink-0 flex flex-col items-center space-y-4">
              <AvatarUpload
                currentAvatarUrl={profile?.avatarUrl}
                onAvatarUpdate={handleUpdateAvatar}
              />
              {!isEditing && (
                 <div className="text-center">
                    <p className="text-lg font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                 </div>
              )}
            </div>

            {/* Main Content */}
            <div className="grow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {isEditing ? 'Edit Profile' : 'User Profile'}
                  </h1>
                  {!isEditing && profile?.bio && (
                      <p className="text-slate-300 max-w-lg">{profile.bio}</p>
                  )}
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <EditProfileForm
                  user={user}
                  profile={profile}
                  onSubmit={handleUpdateProfile}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="space-y-6">
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.location?.city && (
                      <div className="flex items-center text-slate-400">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                        <span>{profile.location.city}, {profile.location.country}</span>
                      </div>
                    )}
                    {profile?.dateOfBirth && (
                      <div className="flex items-center text-slate-400">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                        <span>Born {new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                     {profile?.phone && (
                      <div className="flex items-center text-slate-400">
                        <span className="mr-2 text-indigo-400">📞</span>
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-slate-400">
                        <Mail className="w-4 h-4 mr-2 text-indigo-400" />
                        <span>{user.email}</span>
                      </div>
                  </div>

                  {/* Social Links */}
                  {profile?.socialLinks && Object.values(profile.socialLinks).some(link => !!link) && (
                    <div className="pt-6 border-t border-slate-800">
                      <h3 className="text-sm font-medium text-slate-300 mb-4">Connect</h3>
                      <div className="flex flex-wrap gap-3">
                         {profile.socialLinks.github && (
                            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm" className="bg-slate-800 hover:bg-slate-700">
                                    <Github className="w-4 h-4 mr-2" /> GitHub
                                </Button>
                            </a>
                         )}
                          {profile.socialLinks.linkedin && (
                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm" className="bg-slate-800 hover:bg-slate-700">
                                    <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                                </Button>
                            </a>
                         )}
                          {profile.socialLinks.twitter && (
                            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm" className="bg-slate-800 hover:bg-slate-700">
                                    <Twitter className="w-4 h-4 mr-2" /> Twitter
                                </Button>
                            </a>
                         )}
                          {/* Fallback for website or generic link */}
                          {profile.socialLinks.website && (
                            <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm" className="bg-slate-800 hover:bg-slate-700">
                                    <Globe className="w-4 h-4 mr-2" /> Website
                                </Button>
                            </a>
                         )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
