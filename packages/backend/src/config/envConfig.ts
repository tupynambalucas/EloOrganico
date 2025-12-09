import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import path from 'path';

const schema = {
  type: 'object',
  required: [
    'SERVER_PORT', 
    'SERVER_HOST', 
    'MONGO_URI', 
    'JWT_SECRET', 
    'SESSION_SECRET',
    'ADMIN_USER_SEED',
    'ADMIN_EMAIL_SEED',
    'ADMIN_PASS_SEED',
    'USER_SESSION_KEY',
    'NODE_ENV'
  ],
  properties: {
    SERVER_PORT: { type: 'number' },
    SERVER_HOST: { type: 'string' },
    NODE_ENV: { type: 'string' },
    MONGO_URI: { type: 'string' },
    
    ADMIN_USER_SEED: { type: 'string' },
    ADMIN_EMAIL_SEED: { type: 'string' },
    ADMIN_PASS_SEED: { type: 'string' },

    JWT_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    USER_SESSION_KEY: { type: 'string' },
  }
};

const envConfig = async (server: any) => {
  const rootEnvPath = path.join(__dirname, '../../../../.env');

  await server.register(fastifyEnv, {
    confKey: 'config',
    schema: schema,
    dotenv: process.env.NODE_ENV === 'production' ? false : { path: rootEnvPath },
    data: process.env 
  });
};

export default fp(envConfig);