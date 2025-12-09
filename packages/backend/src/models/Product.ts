import { Schema, Document, model } from 'mongoose';
import type { IProduct } from '@elo-organico/shared';

export type IProductDocument = Omit<IProduct, '_id'> & Document;

export const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  measure: {
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, required: true },
    minimumOrder: {
      type: { type: String },
      value: { type: Schema.Types.Mixed },
    },
  },
  available: { type: Boolean, default: false },
}, { timestamps: true });

export const Product = model<IProductDocument>('Product', productSchema);