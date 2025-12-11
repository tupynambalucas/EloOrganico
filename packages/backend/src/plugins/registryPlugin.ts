import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie'; // <--- Importe isto

import envConfig from '../config/envConfig';
import utils from '../config/utilsConfig';
import secureSession from './sessionPlugin';
import MongoosePlugin from './mongoosePlugin';
import SecurityPlugin from './securityPlugin';
import ApiPlugin from './apiPlugin';

import { AuthRepository } from '../features/auth/auth.repository';
import { AuthService } from '../features/auth/auth.service';
import { AuthController } from '../features/auth/auth.controller';

import { ProductRepository } from '../features/product/product.repository';
import { ProductService } from '../features/product/product.service';
import { ProductController } from '../features/product/product.controller';

import { CycleRepository } from '../features/cycle/cycle.repository';
import { CycleService } from '../features/cycle/cycle.service';
import { CycleController } from '../features/cycle/cycle.controller';

const serverAutoRegistry: FastifyPluginAsync = async function (server) {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(utils);
  await server.register(envConfig);
  
  // --- MUDANÇA CRÍTICA ---
  // Registramos o cookie parser AQUI, no nível raiz, com o segredo.
  // Isso disponibiliza 'unsignCookie' para todo o app (Session e CSRF).
  await server.register(fastifyCookie, {
    secret: server.config.SESSION_SECRET, // Usa o mesmo segredo da sessão ou crie um COOKIE_SECRET
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

  await server.register(ApiPlugin, { prefix: '/api' });

  const allowedOrigins = ['http://localhost:5173'];

  await server.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
}

export default fp(serverAutoRegistry);