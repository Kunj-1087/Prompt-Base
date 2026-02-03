import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUserProfile extends Document {
  user: Types.ObjectId;
  bio?: string;
  phone?: string;
  location?: {
    city?: string;
    country?: string;
  };
  dateOfBirth?: Date;
  socialLinks?: Map<string, string>;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    dateOfBirth: {
      type: Date,
    },
    socialLinks: {
      type: Map,
      of: String,
      default: {},
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    preferences: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile: Model<IUserProfile> = mongoose.model<IUserProfile>(
  'UserProfile',
  userProfileSchema
);

export default UserProfile;
