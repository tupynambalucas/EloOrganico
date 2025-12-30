import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerSchema, loginSchema } from './auth.schema.js';

const authRoutes: FastifyPluginAsync = async (server: FastifyInstance): Promise<void> => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const controller = server.authController;

  app.post('/register', { schema: registerSchema }, controller.registerHandler);
  app.post('/login', { schema: loginSchema }, controller.loginHandler);
  app.post('/logout', controller.logoutHandler);

  app.get('/verify', { preHandler: [server.authenticate] }, controller.verifyHandler);
};

export default authRoutes;
