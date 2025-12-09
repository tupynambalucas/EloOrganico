import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterDTO, LoginDTO } from '@elo-organico/shared';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  registerHandler = async (
    request: FastifyRequest<{ Body: RegisterDTO }>,
    reply: FastifyReply
  ) => {
    try {
      await this.authService.register(request.body);
      return reply.status(201).send({ message: 'Usuário criado com sucesso' });
    } catch (error: any) {
      return reply.status(409).send({ message: error.message });
    }
  }

  loginHandler = async (
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.authService.login(request.body);
      request.session.token = result.token;
      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({ authenticated: false, message: error.message });
    }
  }

  logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.session) {
      await request.session.destroy();
    }
    return reply.send({ message: 'Logout realizado com sucesso' });
  }

  verifyHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.token) {
      return reply.status(401).send({ message: "Sessão não encontrada." });
    }

    try {
      const result = await this.authService.verify(request.session.token);
      return reply.send(result);
    } catch (err) {
      return reply.status(401).send({ message: "Token inválido ou expirado." });
    }
  }
}