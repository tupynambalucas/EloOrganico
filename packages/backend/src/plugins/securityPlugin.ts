import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const securityPlugin: FastifyPluginAsync = async function (server: FastifyInstance) {
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