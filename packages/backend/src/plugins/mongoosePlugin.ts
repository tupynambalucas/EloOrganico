import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Cycle } from '../models/cycle.model.js';

const MongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    const mongoUri = server.config.MONGO_URI;

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    server.log.info('✅ Mongoose connected successfully.');

    server.decorate('mongoose', connection);

    const models = {
      User,
      Product,
      Cycle,
    };

    server.decorate('models', models);
    server.log.info('📚 Mongoose models decorated.');

    server.addHook('onClose', async (instance) => {
      await instance.mongoose.connection.close();
      instance.log.info('Mongoose connection closed.');
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export default fp(MongoosePlugin);
