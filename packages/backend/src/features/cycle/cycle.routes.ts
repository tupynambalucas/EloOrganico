import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  createCycleSchema, 
  getHistorySchema, 
  getCycleByIdSchema,
  updateCycleSchema
} from './cycle.schema';

const cycleRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const controller = server.cycleController;

  app.get('/cycles/active', controller.getActiveCycleHandler);

  app.post('/admin/cycles', { 
    schema: createCycleSchema,
    preHandler: [server.authenticate, server.verifyAdmin]
  }, controller.createCycleHandler);
  
  app.patch('/admin/cycles/:id', { 
    schema: updateCycleSchema,
    preHandler: [server.authenticate, server.verifyAdmin]
  }, controller.updateCycleHandler);

  app.get('/admin/cycles/history', { 
    schema: getHistorySchema,
    preHandler: [server.authenticate, server.verifyAdmin]
  }, controller.getCycleHistoryHandler);
  
  app.get('/admin/cycles/:id', { 
    schema: getCycleByIdSchema,
    preHandler: [server.authenticate, server.verifyAdmin]
  }, controller.getCycleByIdHandler);
};

export default cycleRoutes;