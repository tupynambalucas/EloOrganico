import { FastifyZodHandler } from '../../types/fastify';
import { AuthService } from './auth.service';
import { RegisterRoute, LoginRoute } from './auth.schema';

export class AuthController {
  constructor(private authService: AuthService) {}

  registerHandler: FastifyZodHandler<RegisterRoute> = async (req, reply) => {
    try {
      await this.authService.register(req.body);
      return reply.status(201).send({ message: 'Usuário criado com sucesso' });
    } catch (error: any) {
      return reply.status(409).send({ message: error.message });
    }
  }

  loginHandler: FastifyZodHandler<LoginRoute> = async (req, reply) => {
    try {
      const result = await this.authService.login(req.body);
      
      // Salva o token na sessão (httpOnly cookie)
      if (req.session) {
        req.session.token = result.token;
      }
      
      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({ authenticated: false, message: error.message });
    }
  }

  // Handler sem schema específico (apenas tipo vazio ou genérico)
  logoutHandler: FastifyZodHandler<{}> = async (req, reply) => {
    if (req.session) {
      await req.session.destroy();
    }
    return reply.send({ message: 'Logout realizado com sucesso' });
  }

  verifyHandler: FastifyZodHandler<{}> = async (req, reply) => {
    if (!req.session.token) {
      return reply.status(401).send({ message: "Sessão não encontrada." });
    }

    try {
      const result = await this.authService.verify(req.session.token);
      return reply.send(result);
    } catch (err) {
      return reply.status(401).send({ message: "Token inválido ou expirado." });
    }
  }
}