import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from '../features/auth/auth.routes';
import cycleRoutes from '../features/cycles/cycle.routes';
import productRoutes from '../features/products/product.routes';

const apiPlugin: FastifyPluginAsync = async function (server: FastifyInstance, opts: FastifyPluginOptions) {
  
  await server.register(authRoutes, { prefix: 'auth' });
  await server.register(cycleRoutes);
  await server.register(productRoutes); // Nova rota registrada
}

export default apiPlugin;