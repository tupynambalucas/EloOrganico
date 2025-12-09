import cors from '@fastify/cors'
import envConfig from '../config/envConfig'
import utils from '../config/utilsConfig'
import secureSession from './sessionPlugin'
import MongoosePlugin from './mongoosePlugin';
import fp from 'fastify-plugin'
import ApiPlugin from './apiPlugin';
import type { FastifyPluginAsync } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const serverAutoRegistry: FastifyPluginAsync = async function (server) {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(utils)
  await server.register(envConfig)
  await server.register(MongoosePlugin)
  await server.register(secureSession)
  

  await server.register(ApiPlugin, { prefix: '/api' });

  const allowedOrigins = [ 'http://localhost:5173'];

  await server.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Adicionei métodos comuns de REST
    credentials: true,
  });
}

export default fp(serverAutoRegistry);