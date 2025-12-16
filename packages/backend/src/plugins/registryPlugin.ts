import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';
import fastifyMetrics from 'fastify-metrics';

import envConfig from '../config/envConfig';
import utils from '../config/utilsConfig';
import secureSession from './sessionPlugin';
import MongoosePlugin from './mongoosePlugin';
import SecurityPlugin from './securityPlugin';
import ApiPlugin from './apiPlugin';
import sentryPlugin from './sentryPlugin';
import errorHandlerPlugin from './errorHandlerPlugin';
import queuePlugin from './queuePlugin'; // [NOVO]

import { AuthRepository } from '../domains/auth/auth.repository';
import { AuthService } from '../domains/auth/auth.service';
import { AuthController } from '../domains/auth/auth.controller';

import { ProductRepository } from '../domains/product/product.repository';
import { ProductService } from '../domains/product/product.service';
import { ProductController } from '../domains/product/product.controller';

import { CycleRepository } from '../domains/cycle/cycle.repository';
import { CycleService } from '../domains/cycle/cycle.service';
import { CycleController } from '../domains/cycle/cycle.controller';

const serverAutoRegistry: FastifyPluginAsync = async function (server: FastifyInstance) {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(utils);
  await server.register(envConfig);
  await server.register(sentryPlugin);
  
  await server.register(fastifyMetrics, { endpoint: '/metrics' });

  await server.register(errorHandlerPlugin);

  await server.register(fastifyCookie, {
    secret: server.config.SESSION_SECRET,
  });

  await server.register(MongoosePlugin);
  await server.register(secureSession);
  await server.register(SecurityPlugin);

  const { User, Product, Cycle } = server.models;

  const authRepo = new AuthRepository(User);
  const authService = new AuthService(authRepo, server);
  const authController = new AuthController(authService);

  const productRepo = new ProductRepository(Product);
  const productService = new ProductService(productRepo);
  const productController = new ProductController(productService);

  const cycleRepo = new CycleRepository(Cycle);
  const cycleService = new CycleService(cycleRepo, productService, server.mongoose);
  const cycleController = new CycleController(cycleService);

  server.decorate('authController', authController);
  server.decorate('productController', productController);
  server.decorate('cycleController', cycleController);
  
  server.decorate('cycleService', cycleService); // [NOVO]

  await server.register(ApiPlugin, { prefix: '/api' });
  await server.register(queuePlugin); // [NOVO]

  const allowedOrigins = ['http://localhost:5173', 'http://localhost:80'];

  await server.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'CSRF-Token'],
    exposedHeaders: ['CSRF-Token']
  });
}

export default fp(serverAutoRegistry);