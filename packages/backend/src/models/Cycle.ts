import { Schema, Document, model, Types } from 'mongoose';
export type { ICycle } from '@sharedType/db-models.js';
import type { ICycle } from '@sharedType/db-models.js';

// 1. Omit all conflicting properties: _id, products, and the date fields.
export type ICycleDocument = Omit<ICycle, '_id' | 'products' | 'openingDate' | 'closingDate'> & Document & {
  // 2. Re-declare the properties with their correct Mongoose/database types.
  openingDate: Date;
  closingDate: Date;
  products: Types.ObjectId[];
};

// 3. The schema itself remains unchanged, as it was already correct.
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