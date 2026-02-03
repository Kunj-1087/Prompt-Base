import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Item: Model<IItem> = mongoose.model<IItem>('Item', itemSchema);

export default Item;
