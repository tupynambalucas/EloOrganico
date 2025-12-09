import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';

export default fp(async (server) => {
  await server.register(csrf, {
    cookieOpts: { 
      signed: true, // Correção: de '_signed' para 'signed'
      httpOnly: true, 
      secure: server.config.NODE_ENV === 'production' 
    }
  });

  server.get('/api/csrf-token', async (req, reply) => {
    const token = await reply.generateCsrf();
    return { token };
  });
});