import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import path from 'path';
import { fileURLToPath } from 'url';
import type { FastifyInstance } from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = {
  type: 'object',
  required: [
    'SERVER_PORT',
    'SERVER_HOST',
    'MONGO_URI',
    'REDIS_HOST',
    'REDIS_PORT',
    'JWT_SECRET',
    'SESSION_SECRET',
    'ADMIN_USER_SEED',
    'ADMIN_EMAIL_SEED',
    'ADMIN_PASS_SEED',
    'USER_SESSION_KEY',
    'NODE_ENV',
  ],
  properties: {
    SERVER_PORT: { type: 'number' },
    SERVER_HOST: { type: 'string' },
    NODE_ENV: { type: 'string' },
    MONGO_URI: { type: 'string' },

    REDIS_HOST: { type: 'string' },
    REDIS_PORT: { type: 'number', default: 6379 },

    ADMIN_USER_SEED: { type: 'string' },
    ADMIN_EMAIL_SEED: { type: 'string' },
    ADMIN_PASS_SEED: { type: 'string' },

    JWT_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    USER_SESSION_KEY: { type: 'string' },
    SENTRY_DSN: { type: 'string' },
  },
};

const envConfig = async (server: FastifyInstance) => {
  const rootEnvPath = path.join(__dirname, '../../../../.env');

  await server.register(fastifyEnv, {
    confKey: 'config',
    schema: schema,
    dotenv: {
      path: rootEnvPath,
      debug: process.env.NODE_ENV === 'development',
    },
  });
};

export default fp(envConfig);
