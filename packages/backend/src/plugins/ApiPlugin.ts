import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from '../features/auth/auth.routes';
import cycleRoutes from '../features/cycles/cycle.routes';

const apiPlugin: FastifyPluginAsync = async function (server: FastifyInstance, opts: FastifyPluginOptions) {
  
  await server.register(authRoutes, { prefix: 'auth' });
  
  // Alteração: Removemos o prefixo 'admin' daqui. 
  // O controle de rota será feito dentro do arquivo cycle.routes.ts
  await server.register(cycleRoutes);
}

export default apiPlugin;