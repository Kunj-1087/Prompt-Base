import mongoose, { Schema, Document } from 'mongoose';

export interface IABTestVariant {
  name: string;
  weight: number; // Percentage 0-100
  config: Record<string, any>;
}

export interface IABTest extends Document {
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  variants: IABTestVariant[];
  targetMetric: string;
  startDate?: Date;
  endDate?: Date;
  sampleSize?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IABTestAssignment extends Document {
  testId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  variantName: string;
  assignedAt: Date;
  converted: boolean;
  convertedAt?: Date;
  metadata: Record<string, any>;
}

const abTestVariantSchema = new Schema<IABTestVariant>(
  {
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    config: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const abTestSchema = new Schema<IABTest>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed'],
      default: 'draft',
      index: true,
    },
    variants: {
      type: [abTestVariantSchema],
      required: true,
      validate: {
        validator: function (variants: IABTestVariant[]) {
          const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
          return totalWeight === 100;
        },
        message: 'Variant weights must sum to 100',
      },
    },
    targetMetric: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    sampleSize: {
      type: Number,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const abTestAssignmentSchema = new Schema<IABTestAssignment>(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'ABTest',
      required: true,
      index: true,
    },
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
    variantName: {
      type: String,
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    converted: {
      type: Boolean,
      default: false,
      index: true,
    },
    convertedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
abTestAssignmentSchema.index({ testId: 1, userId: 1 }, { unique: true, sparse: true });
abTestAssignmentSchema.index({ testId: 1, sessionId: 1 }, { unique: true });
abTestAssignmentSchema.index({ testId: 1, variantName: 1 });

export const ABTest = mongoose.model<IABTest>('ABTest', abTestSchema);
export const ABTestAssignment = mongoose.model<IABTestAssignment>('ABTestAssignment', abTestAssignmentSchema);
