export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProfile {
  _id: string;
  user: string; // User ID
  bio?: string;
  phone?: string;
  location?: {
    city?: string;
    country?: string;
  };
  dateOfBirth?: string; // ISO Date string
  socialLinks?: Record<string, string>; // Using Record for Map-like structure in JSON
  avatarUrl?: string;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  user: IUser;
  profile: IUserProfile | null;
}
