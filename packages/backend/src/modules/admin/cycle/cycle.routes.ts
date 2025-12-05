import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createCycleHandler } from './cycle.controller';
import { createCycleSchema } from './cycle.schema';

const cycleRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  
  app.post('/cycle', { schema: createCycleSchema }, createCycleHandler);
};

export default cycleRoutes;