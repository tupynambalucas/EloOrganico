import { Model } from 'mongoose';
import { IUserDocument } from '../../models/user.model';
import { RegisterDTO } from '@elo-organico/shared';
import { IAuthRepository } from './auth.repository.interface';

export class AuthRepository implements IAuthRepository {
  constructor(private userModel: Model<IUserDocument>) {}

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmailOrUsername(email: string, username: string) {
    return this.userModel.findOne({ $or: [{ email }, { username }] });
  }

  async findByIdentifier(identifier: string) {
    return this.userModel.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    }).select('+password');
  }

  async create(data: RegisterDTO) {
    const newUser = new this.userModel({ ...data, role: 'user' });
    return newUser.save();
  }
}