import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Cycle } from '../models/cycle.model.js';

const MongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    const mongoUri = server.config.MONGO_URI;

    // Configurações recomendadas para evitar timeouts em conexões instáveis
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    server.log.info('✅ Mongoose connected successfully.');
    
    // Decora a instância do Fastify com a conexão do Mongoose
    server.decorate('mongoose', connection);

    // Registra os Models para acesso rápido via server.models.*
    const models = {
      User,
      Product,
      Cycle,
    };

    server.decorate('models', models);
    server.log.info('📚 Mongoose models decorated.');

    // A LÓGICA DE SEED FOI REMOVIDA DAQUI E MOVIDA PARA src/scripts/seedAdmin.ts

    // Fecha conexão ao encerrar o servidor Fastify
    server.addHook('onClose', async (instance) => {
      await instance.mongoose.connection.close();
      instance.log.info('Mongoose connection closed.');
    });

  } catch (err) {
    server.log.error(err);
    // É uma boa prática derrubar o processo se o banco não conectar na inicialização
    process.exit(1); 
  }
};

export default fp(MongoosePlugin);