import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  createCycleHandler, 
  getActiveCycleHandler, 
  getCycleHistoryHandler, 
  getCycleByIdHandler 
} from './cycle.controller';
import { 
  createCycleSchema, 
  getHistorySchema, 
  getCycleByIdSchema 
} from './cycle.schema';

const cycleRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();

  // PÚBLICO: Ciclo Ativo
  app.get('/cycles/active', getActiveCycleHandler);

  // ADMIN: Criar Ciclo
  app.post('/admin/cycles', { schema: createCycleSchema }, createCycleHandler);

  // ADMIN: Listar Histórico (Paginado)
  app.get('/admin/cycles/history', { schema: getHistorySchema }, getCycleHistoryHandler);

  // ADMIN: Detalhes de um Ciclo Específico
  app.get('/admin/cycles/:id', { schema: getCycleByIdSchema }, getCycleByIdHandler);
};

export default cycleRoutes;