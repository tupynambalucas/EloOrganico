import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';
import type { FastifyPluginAsync } from 'fastify';

const securityPlugin: FastifyPluginAsync = async function (server) {
  await server.register(csrf, {
    cookieOpts: { 
      signed: true,
      httpOnly: true, 
      path: '/api',
      secure: server.config.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  });

  server.get('/api/csrf-token', async (req, reply) => {
    const token = reply.generateCsrf();
    return { token };
  });
};

export default fp(securityPlugin);