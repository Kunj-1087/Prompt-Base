import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  device?: string; // e.g., "Chrome on Windows"
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string; // e.g., "New York, US"
  lastActivity: Date;
  expiresAt: Date;
  createdAt: Date;
  isValid: boolean;
}

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    device: { type: String },
    browser: { type: String },
    os: { type: String },
    ipAddress: { type: String },
    location: { type: String },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // For cleanup queries
    },
    isValid: {
        type: Boolean,
        default: true
    }
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired sessions? 
// Or keep them for history but mark invalid? 
// Let's use TTL strictly on expiresAt for now to keep DB clean.
// But expiresAt is for the Refresh Token validity (7-30 days).
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session: Model<ISession> = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
