import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  createCycleHandler, 
  getActiveCycleHandler, 
  getCycleHistoryHandler, 
  getCycleByIdHandler,
  updateCycleHandler
} from './cycle.controller';
import { 
  createCycleSchema, 
  getHistorySchema, 
  getCycleByIdSchema,
  updateCycleSchema
} from './cycle.schema';

const cycleRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();

  // Público
  app.get('/cycles/active', getActiveCycleHandler);

  // Admin
  app.post('/admin/cycles', { schema: createCycleSchema }, createCycleHandler);
  
  app.patch('/admin/cycles/:id', { schema: updateCycleSchema }, updateCycleHandler);

  app.get('/admin/cycles/history', { schema: getHistorySchema }, getCycleHistoryHandler);
  
  app.get('/admin/cycles/:id', { schema: getCycleByIdSchema }, getCycleByIdHandler);
};

export default cycleRoutes;