import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerHandler, loginHandler, logoutHandler, verifyHandler } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';

const authRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post('/register', { schema: registerSchema }, registerHandler);
  app.post('/login', { schema: loginSchema }, loginHandler);
  app.post('/logout', logoutHandler);
  app.get('/verify', verifyHandler);
};

export default authRoutes;