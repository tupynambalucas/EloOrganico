import type { FastifyInstance } from 'fastify';
import type { RegisterDTO, LoginDTO } from '@elo-organico/shared';
import type { IAuthRepository } from './auth.repository.interface.js';
import type { IUserDocument } from '../../models/user.model.js';
import { AppError } from '../../utils/AppError.js';

interface LoginResponse {
  user: IUserDocument;
  token: string;
}

export class AuthService {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly server: FastifyInstance,
  ) {}

  public async register(data: RegisterDTO): Promise<IUserDocument> {
    const existingUser = await this.authRepo.findByEmailOrUsername(data.email, data.username);

    if (existingUser) {
      const code =
        existingUser.email === data.email ? 'EMAIL_ALREADY_EXISTS' : 'USERNAME_ALREADY_EXISTS';
      throw new AppError(code, 409);
    }

    return this.authRepo.create(data);
  }

  public async login(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.authRepo.findByIdentifier(data.identifier);

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404);
    }

    if (!user.password) {
      throw new AppError('INVALID_PASSWORD', 401);
    }

    const isValid = await this.server.compareHash(data.password, user.password);
    if (!isValid || isValid instanceof Error) {
      throw new AppError('INVALID_PASSWORD', 401);
    }

    const token = this.server.jwt.sign({
      _id: String(user._id),
      email: user.email,
      username: user.username,
      role: user.role,
      icon: user.icon,
    });

    return { user, token };
  }

  public async validateUser(id: string): Promise<IUserDocument | null> {
    return this.authRepo.findById(id);
  }
}
