import { RegisterDTO } from '@elo-organico/shared';
import { IUserDocument } from '../../models/user.model';

export interface IAuthRepository {
  findById(id: string): Promise<IUserDocument | null>;
  findByEmailOrUsername(email: string, username: string): Promise<IUserDocument | null>;
  findByIdentifier(identifier: string): Promise<IUserDocument | null>;
  create(data: RegisterDTO): Promise<IUserDocument>;
}