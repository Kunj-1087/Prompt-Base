import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrompt extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  metadata?: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promptSchema = new Schema<IPrompt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'archived'],
      default: 'draft',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    tags: {
      type: [String],
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

// Text Index for full-text search
promptSchema.index({ title: 'text', description: 'text' });

// Query middleware to exclude soft-deleted documents by default? 
// Or handle in controller. Handling in controller allows admin to see deleted.
// Let's keep model clean.

const Prompt: Model<IPrompt> = mongoose.model<IPrompt>('Prompt', promptSchema);

export default Prompt;
