import { FastifyInstance } from 'fastify';
import { RegisterDTO, LoginDTO } from '@elo-organico/shared';
import { IAuthRepository } from './auth.repository.interface';
import { AppError } from '../../utils/AppError';

export class AuthService {
  constructor(
    private authRepo: IAuthRepository,
    private server: FastifyInstance
  ) {}

  async register(data: RegisterDTO) {
    const existingUser = await this.authRepo.findByEmailOrUsername(data.email, data.username);

    if (existingUser) {
      const code = existingUser.email === data.email 
        ? 'EMAIL_ALREADY_EXISTS' 
        : 'USERNAME_ALREADY_EXISTS';
      throw new AppError(code, 409);
    }

    return this.authRepo.create(data);
  }

  async login(data: LoginDTO) {
    const user = await this.authRepo.findByIdentifier(data.identifier);

    // Alterado para retornar erro específico de usuário
    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404);
    }

    // Verifica a senha apenas se o usuário existir
    if (!user.password) {
        throw new AppError('INVALID_PASSWORD', 401);
    }

    const isValid = await this.server.compareHash(data.password, user.password);
    if (!isValid) {
      throw new AppError('INVALID_PASSWORD', 401);
    }

    const token = this.server.jwt.sign({ 
      _id: user.id, 
      icon: user.icon, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    });

    return { 
      authenticated: true, 
      token, 
      user 
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.server.jwt.verify(token);
      return { authenticated: true, user: payload };
    } catch {
      throw new AppError('SESSION_EXPIRED', 401);
    }
  }
}