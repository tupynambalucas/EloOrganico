import { FastifyZodHandler } from '../../types/fastify';
import { AuthService } from './auth.service';
import { RegisterRoute, LoginRoute } from './auth.schema';
import { AppError } from '../../utils/AppError';

export class AuthController {
  constructor(private authService: AuthService) {}

  private mapUserResponse(user: any) {
    if (!user) return undefined;

    const obj = typeof user.toObject === 'function' ? user.toObject() : user;
    
    const safeUser = { ...obj };
    delete safeUser.password;
    delete safeUser.__v;

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

  logoutHandler: FastifyZodHandler<Record<string, never>> = async (req, reply) => {
    if (req.session) {
      await req.session.destroy();
    }
    return reply.send({ message: 'LOGOUT_SUCCESSFUL' });
  }

  verifyHandler: FastifyZodHandler<Record<string, never>> = async (req, reply) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : req.session?.token;

    if (!token) {
      throw new AppError('TOKEN_MISSING', 401);
    }

    const result = await this.authService.verifyToken(token);
    return reply.send(result);
  }
}