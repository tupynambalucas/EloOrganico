import { FastifyInstance } from 'fastify';
import { RegisterDTO, LoginDTO } from '@elo-organico/shared';
import { AuthRepository } from './auth.repository';

export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private server: FastifyInstance
  ) {}

  async register(data: RegisterDTO) {
    const existingUser = await this.authRepo.findByEmailOrUsername(data.email, data.username);

    if (existingUser) {
      const message = existingUser.email === data.email 
        ? 'Email já cadastrado.' 
        : 'Nome de usuário já existe.';
      throw new Error(message);
    }

    return this.authRepo.create(data);
  }

  async login(data: LoginDTO) {
    const user = await this.authRepo.findByIdentifier(data.identifier);

    if (!user || !user.password) {
      throw new Error('Credenciais inválidas');
    }

    const isValid = await this.server.compareHash(data.password, user.password);
    if (!isValid) {
      throw new Error('Credenciais inválidas');
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
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        icon: user.icon
      }
    };
  }

  async verify(token: string) {
    const payload = this.server.jwt.verify(token); 
    
    const userId = (payload as any)._id;

    const user = await this.authRepo.findById(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return {
      authenticated: true,
      token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        icon: user.icon
      }
    };
  }
}