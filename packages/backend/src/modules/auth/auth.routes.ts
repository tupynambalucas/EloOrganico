import { FastifyPluginAsync } from 'fastify';
import { registerHandler, loginHandler, logoutHandler, verifyHandler } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';

const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/register', { schema: registerSchema }, registerHandler);
  server.post('/login', { schema: loginSchema }, loginHandler);
  server.post('/logout', logoutHandler);
  server.get('/verify', verifyHandler);
};

export default authRoutes;