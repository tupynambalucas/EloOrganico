import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyJwt from '@fastify/jwt';
import bcrypt from 'bcrypt';
import { UserPayload } from '../types/fastify'; // Importamos o tipo para usar no Generic

const SessionPlugin: FastifyPluginAsync = async (server) => {

  server.decorate('genHash', async (password: string) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      server.log.error(error);
      throw error;
    }
  });

  server.decorate('compareHash', async (password: string, hashedPass: string) => {
    try {
      return await bcrypt.compare(password, hashedPass);
    } catch (error) {
      server.log.error(error);
      return false;
    }
  });

  await server.register(fastifyCookie);

  await server.register(fastifySession, {
    cookieName: server.config.USER_SESSION_KEY,
    secret: server.config.SESSION_SECRET,
    cookie: { 
      secure: server.config.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 86400000 
    }, 
    saveUninitialized: false,
  });

  await server.register(fastifyJwt, {
    secret: server.config.JWT_SECRET,
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.session.token;

      if (!token) {
        return reply.status(401).send({ message: 'Não autenticado' });
      }

      const decoded = server.jwt.verify<UserPayload>(token);
      
      request.user = decoded;

    } catch (err) {
      return reply.status(401).send({ message: 'Sessão inválida ou expirada' });
    }
  });

  server.decorate('verifyAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user || request.user.role !== 'admin') {
        return reply.status(403).send({ message: 'Acesso negado' });
      }
    } catch (err) {
      return reply.status(401).send({ message: 'Erro de verificação' });
    }
  });
};

export default fp(SessionPlugin);