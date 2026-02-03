import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  metadata?: Record<string, any>;
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
      required: true,
    },
    metadata: {
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

const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
