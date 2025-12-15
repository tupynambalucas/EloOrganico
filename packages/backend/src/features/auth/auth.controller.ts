import { FastifyZodHandler } from '../../types/fastify';
import { AuthService } from './auth.service';
import { RegisterRoute, LoginRoute } from './auth.schema';

export class AuthController {
  constructor(private authService: AuthService) {}

  private mapUserResponse(user: any) {
    if (!user) return undefined;

    const obj = typeof user.toObject === 'function' ? user.toObject() : user;
    
    const { password, __v, ...safeUser } = obj;

    return {
      ...safeUser,
      _id: safeUser._id?.toString(),
      createdAt: safeUser.createdAt ? new Date(safeUser.createdAt).toISOString() : undefined,
      updatedAt: safeUser.updatedAt ? new Date(safeUser.updatedAt).toISOString() : undefined,
    };
  }

  registerHandler: FastifyZodHandler<RegisterRoute> = async (req, reply) => {
    await this.authService.register(req.body);
    return reply.status(201).send({ message: 'USER_CREATED_SUCCESSFULLY' });
  }

  loginHandler: FastifyZodHandler<LoginRoute> = async (req, reply) => {
    const result = await this.authService.login(req.body);
    
    if (req.session) {
      req.session.token = result.token;
    }
    
    return reply.send({
      ...result,
      user: this.mapUserResponse(result.user)
    });
  }

  logoutHandler: FastifyZodHandler<{}> = async (req, reply) => {
    if (req.session) {
      await req.session.destroy();
    }
    return reply.send({ message: 'LOGOUT_SUCCESSFUL' });
  }

  verifyHandler: FastifyZodHandler<{}> = async (req, reply) => {
    if (!req.session?.token) {
      return reply.status(401).send({ authenticated: false, message: 'NOT_AUTHENTICATED' });
    }

    const result = await this.authService.verify(req.session.token);
    
    return reply.send({
      ...result,
      user: this.mapUserResponse(result.user)
    });
  }
}