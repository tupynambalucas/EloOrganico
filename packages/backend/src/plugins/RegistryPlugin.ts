import cors from '@fastify/cors'
import envConfig from '../config/env.js'
import utils from '../config/utils.js'
import secureSession from './SessionPlugin.js'
import MongoosePlugin from './MongoosePlugin.js';
import fp from 'fastify-plugin'
import ApiPlugin from './ApiPlugin.js';
import { resolve } from 'node:path'
import type { FastifyPluginAsync } from 'fastify'

const serverAutoRegistry: FastifyPluginAsync = async function (server) {
  await server.register(utils)
  await server.register(envConfig)
  await server.register(MongoosePlugin)
  await server.register(secureSession)
  await server.register(ApiPlugin, { prefix: '/api/v1' });

  const viteDevServerUrl = 'http://localhost:8080';
  const allowedOrigins = ['https://www.dropbox.com/', viteDevServerUrl];

  await server.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  });
}

export default fp(serverAutoRegistry);