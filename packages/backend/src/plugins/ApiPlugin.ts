import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';
import auth from '../api/auth';
import adminPanel from '../api/admin/sharing';

const ApiPlugin: FastifyPluginAsync = async function (server: FastifyInstance, opts: FastifyPluginOptions) {
  // This part is correct, it passes the options down
  await server.register(auth, {prefix: 'auth'});
  await server.register(adminPanel, {prefix: 'admin-panel'});
}

// CORRECTED: Export the plugin directly.
export default ApiPlugin;