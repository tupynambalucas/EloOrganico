import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IUser } from '@elo-organico/shared';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password?: string;
}

export const userSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  username: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

export const User = model<IUserDocument>('User', userSchema);