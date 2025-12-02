import type { FastifyPluginAsync } from 'fastify';

import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyJwt from '@fastify/jwt'
import bcrypt from 'bcrypt';

// Note: The 'jwt' import is unused in the current code since the hook is commented out.
// If you re-enable the hook, this import will be necessary.

// This block augments the FastifyInstance interface with your custom decorators.
// It makes `server.getClient`, `server.genHash`, etc., available to TypeScript.


const SessionPlugin: FastifyPluginAsync = async (server) => {

  /**
   * Decorator to generate a bcrypt hash from a password.
   */
  server.decorate('genHash', async (password: string) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      server.log.error(error, 'Bcrypt hash generation failed');
      // Note: Returning the error object is not ideal. Consider throwing the error instead.
      return error as Error;
    }
  });

  /**
   * Decorator to compare a plain text password with a bcrypt hash.
   */
  server.decorate('compareHash', async (password: string, hashedPass: string) => {
    try {
      return await bcrypt.compare(password, hashedPass);
    } catch (error) {
      server.log.error(error, 'Bcrypt hash comparison failed');
      return error as Error;
    }
  });

  await server.register(fastifyCookie);
  await server.register(fastifySession, {
    secret: server.config.SESSION_SECRET as string,
    cookie: { secure: false }, // Set to true in production with HTTPS
    saveUninitialized: false,
  });

  // 3. Register JWT plugin
  // This is used to secure API endpoints
  await server.register(fastifyJwt, {
    secret: server.config.JWT_SECRET as string,
  });

  // 4. Create a decorator to authenticate API requests via JWT
  server.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  server.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/admin')) {
      if (!request.session.token) {
        return reply.redirect('/');
      }
      try {
        // Verifica o token e extrai os dados do usuário
        const user = server.jwt.verify(request.session.token) as { role: string };
        
        // ADICIONADO: Verifica se a role é 'admin'
        if (user.role !== 'admin') {
          // Se não for admin, nega o acesso.
          // Pode redirecionar para uma página de "acesso negado" ou de volta para o login.
          return reply.redirect('/');
        }
      } catch (err) {
        return reply.status(401).send({ authenticated: false, message: 'Not aunthenticated' });
      }
    }
  });
};

export default fp(SessionPlugin);