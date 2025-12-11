import { FastifyInstance } from 'fastify';
import { RegisterDTO, LoginDTO } from '@elo-organico/shared';
import { AuthRepository } from './auth.repository';
import { AppError } from '../../utils/AppError';

export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private server: FastifyInstance
  ) {}

  async register(data: RegisterDTO) {
    const existingUser = await this.authRepo.findByEmailOrUsername(data.email, data.username);

    if (existingUser) {
      const message = existingUser.email === data.email 
        ? 'Este endereço de e-mail já está sendo utilizado.' 
        : 'Este nome de usuário já está em uso.';
      throw new AppError(message, 409);
    }

    return this.authRepo.create(data);
  }

  async login(data: LoginDTO) {
    const user = await this.authRepo.findByIdentifier(data.identifier);

    if (!user || !user.password) {
      throw new AppError('Credenciais de acesso inválidas.', 401);
    }

    const isValid = await this.server.compareHash(data.password, user.password);
    if (!isValid) {
      throw new AppError('Credenciais de acesso inválidas.', 401);
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

  async verify(token: string) {
    try {
      const payload = this.server.jwt.verify(token); 
      return { authenticated: true, user: payload };
    } catch (err) {
      throw new AppError('Sessão inválida ou expirada.', 401);
    }
  }
}