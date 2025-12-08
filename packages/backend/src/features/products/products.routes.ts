import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listProductsHandler } from './products.controller';
import { listProductsSchema } from './products.schema';

const productRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();

  // ADMIN: Listar todos os produtos (Inventário)
  app.get('/admin/products', { schema: listProductsSchema }, listProductsHandler);
};

export default productRoutes;