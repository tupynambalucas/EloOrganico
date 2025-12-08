import { Schema, Document, model, Types } from 'mongoose';
import type { ICycle } from '@elo-organico/shared';

export interface ICycleDocument extends Omit<ICycle, '_id' | 'products' | 'openingDate' | 'closingDate'>, Document {
  openingDate: Date;
  closingDate: Date;
  products: Types.ObjectId[];
}

export const cycleSchema = new Schema<ICycleDocument>({
  description: {
    type: String,
    trim: true,
  },
  openingDate: {
    type: Date,
    required: true,
  },
  closingDate: {
    type: Date,
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Cycle = model<ICycleDocument>('Cycle', cycleSchema);