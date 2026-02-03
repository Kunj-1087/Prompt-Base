import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'commented' | 'shared';
  entityType: 'prompt' | 'comment' | 'user';
  entityId: mongoose.Types.ObjectId;
  entityTitle?: string;
  details?: Record<string, any>;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'status_changed', 'commented', 'shared'],
      required: true,
    },
    entityType: {
        type: String,
        enum: ['prompt', 'comment', 'user'],
        required: true
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    entityTitle: {
        type: String
    },
    details: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for fast retrieval of latest activities
activitySchema.index({ user: 1, createdAt: -1 });
// Index for entity activities (history)
activitySchema.index({ entityId: 1, createdAt: -1 });

const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
