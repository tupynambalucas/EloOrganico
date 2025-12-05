import { FastifyPluginAsync } from 'fastify';
import { createCycleHandler } from './cycle.controller';
import { createCycleSchema } from './cycle.schema';

const cycleRoutes: FastifyPluginAsync = async (server) => {
  server.post('/cycle', { schema: createCycleSchema }, createCycleHandler);
};

export default cycleRoutes;