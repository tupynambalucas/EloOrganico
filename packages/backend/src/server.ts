import server from './config/FastifyInstance';
import RegistryPlugin from './plugins/RegistryPlugin';

async function startServer() {
  const app = server
  await server.register(RegistryPlugin);

  try {
    await app.listen({ port: server.config.SERVER_PORT, host: server.config.SERVER_HOST });
    console.log(`🚀 Servidor rodando em http://${server.config.SERVER_HOST}:${server.config.SERVER_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();