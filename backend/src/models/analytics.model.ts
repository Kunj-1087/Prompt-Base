import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  eventType: 'page_view' | 'feature_usage' | 'conversion' | 'error' | 'performance' | 'custom';
  eventName: string;
  eventData: Record<string, any>;
  page?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
  };
  performance?: {
    loadTime?: number;
    responseTime?: number;
    resourceSize?: number;
  };
  timestamp: Date;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['page_view', 'feature_usage', 'conversion', 'error', 'performance', 'custom'],
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      index: true,
    },
    eventData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    page: {
      type: String,
    },
    referrer: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    location: {
      country: String,
      city: String,
    },
    performance: {
      loadTime: Number,
      responseTime: Number,
      resourceSize: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ eventName: 1, timestamp: -1 });
analyticsEventSchema.index({ sessionId: 1, timestamp: -1 });

// TTL index to automatically delete old events after 90 days
analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
