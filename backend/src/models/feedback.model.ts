import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId;
  type: 'bug' | 'feature_request' | 'improvement' | 'general' | 'complaint';
  category?: string;
  title: string;
  description: string;
  rating?: number; // 1-5
  email?: string;
  page?: string;
  userAgent?: string;
  screenshot?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  metadata: Record<string, any>;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature_request', 'improvement', 'general', 'complaint'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    page: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    screenshot: {
      type: String, // URL to screenshot
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_review', 'planned', 'in_progress', 'completed', 'rejected'],
      default: 'new',
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    adminNotes: {
      type: String,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ priority: 1, status: 1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
