import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyJwt from '@fastify/jwt';
import bcrypt from 'bcrypt';

const SessionPlugin: FastifyPluginAsync = async (server) => {

  // --- Decorators de Hash (Bcrypt) ---
  server.decorate('genHash', async (password: string) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      server.log.error(error, 'Bcrypt hash generation failed');
      throw error;
    }
  });

  server.decorate('compareHash', async (password: string, hashedPass: string) => {
    try {
      return await bcrypt.compare(password, hashedPass);
    } catch (error) {
      server.log.error(error, 'Bcrypt hash comparison failed');
      return false;
    }
  });

  // --- 1. Register Cookie ---
  await server.register(fastifyCookie);

  // --- 2. Register Session ---
  // Usa a SESSION_SECRET do .env para assinar o cookie de sessão do navegador
  await server.register(fastifySession, {
    secret: server.config.SESSION_SECRET as string,
    cookie: { 
      secure: server.config.NODE_ENV === 'production', // True em produção (HTTPS)
      httpOnly: true, // Protege contra XSS
      maxAge: 86400000 // 24 horas
    }, 
    saveUninitialized: false,
  });


  await server.register(fastifyJwt, {
    secret: server.config.JWT_SECRET as string,
  });

  server.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Token inválido ou expirado' });
    }
  });

  server.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/admin') || request.url.startsWith('/admin')) {
      
      if (!request.session.token) {
        return reply.status(401).send({ message: 'Acesso não autorizado. Faça login.' });
      }

      try {
        const user = server.jwt.verify(request.session.token) as { role: string };
        
        if (user.role !== 'admin') {
          server.log.warn(`Usuário ${JSON.stringify(user)} tentou acessar área admin.`);
          return reply.status(403).send({ message: 'Acesso proibido. Requer privilégios de administrador.' });
        }
      } catch (err) {
        return reply.status(401).send({ authenticated: false, message: 'Sessão inválida.' });
      }
    }
  });
};

export default fp(SessionPlugin);