import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from '../modules/auth/auth.routes';
import cycleRoutes from '../modules/admin/cycle/cycle.routes';

const ApiPlugin: FastifyPluginAsync = async function (server: FastifyInstance, opts: FastifyPluginOptions) {
  
  await server.register(authRoutes, { prefix: 'auth' });
  
  await server.register(cycleRoutes, { prefix: 'admin' });
}

export default ApiPlugin;