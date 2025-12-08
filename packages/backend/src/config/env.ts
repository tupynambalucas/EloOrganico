import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

const schema = {
  type: 'object',
  required: [
    'SERVER_PORT', 
    'SERVER_HOST', 
    'MONGO_URI', 
    'JWT_SECRET', 
    'SESSION_SECRET',
    'ADMIN_PASS_SEED' // Obrigatório agora para validar tamanho
  ],
  properties: {
    SERVER_PORT: { type: 'number', default: 3000 },
    SERVER_HOST: { type: 'string', default: '0.0.0.0' },
    NODE_ENV: { type: 'string', default: 'development' },
    MONGO_URI: { type: 'string' },
    
    // Seeds
    ADMIN_USER_SEED: { type: 'string', default: 'admin' },
    ADMIN_EMAIL_SEED: { type: 'string', default: 'admin@elo.com' },
    ADMIN_PASS_SEED: { type: 'string' },

    // Secrets
    JWT_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    USER_SESSION_KEY: { type: 'string' },  // Adicionado
    ADMIN_SESSION_KEY: { type: 'string' }  // Adicionado
  }
};

const envConfig = async (server: any) => {
  await server.register(fastifyEnv, {
    confKey: 'config',
    schema: schema,
    dotenv: true, // Lê do arquivo .env localmente
    data: process.env // Lê das variáveis injetadas pelo Docker em produção
  });
};

export default fp(envConfig);