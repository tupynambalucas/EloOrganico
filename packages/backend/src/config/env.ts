import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import type { FastifyEnvOptions } from '@fastify/env';
import { resolve } from 'node:path';

const envPlugin: FastifyPluginAsync = async (server) => {

  const schema = {
    type: 'object',
    required: [
      'SERVER_HOST',
      'SERVER_PORT',
      'JWT_SECRET',
      'SESSION_SECRET',
      'MONGO_URI',
      'ADMIN_USER_SEED',
      'ADMIN_EMAIL_SEED',
      'ADMIN_PASS_SEED',
      'USER_SESSION_KEY',
      'ADMIN_SESSION_KEY'
    ],
    properties: {
      SERVER_HOST: { type: 'string' },
      SERVER_PORT: { type: 'number' },
      JWT_SECRET: { type: 'string' },
      SESSION_SECRET: { type: 'string' },
      MONGO_URI: { type: 'string' },
      ADMIN_USER_SEED: { type: 'string' },
      ADMIN_EMAIL_SEED: { type: 'string' },
      ADMIN_PASS_SEED: { type: 'string' },
      USER_SESSION_KEY: { type: 'string' },
      ADMIN_SESSION_KEY: { type: 'string' }
    },
  } as const;

  const envOptions: FastifyEnvOptions = {
    confKey: 'config',
    schema: schema,
    dotenv: {
      path: resolve(__dirname, '../../.env'), 
      debug: process.env.NODE_ENV === 'development'
    },
    data: process.env 
  };

  await server.register(fastifyEnv, envOptions);
};

export default fp(envPlugin);