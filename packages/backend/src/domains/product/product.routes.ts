import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listProductsSchema } from './product.schema.js';

const productRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const controller = server.productController;

  app.get('/admin/products', { 
    schema: listProductsSchema,
    preHandler: [server.authenticate, server.verifyAdmin]
  }, controller.listHandler);
};

export default productRoutes;