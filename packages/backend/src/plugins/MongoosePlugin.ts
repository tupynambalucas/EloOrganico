import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Cycle } from '../models/Cycle';

const MongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    const mongoUri = server.config.MONGO_URI;
    const adminUserSeed = server.config.ADMIN_USER_SEED;
    const adminEmailSeed = server.config.ADMIN_EMAIL_SEED;
    const adminPassSeed = server.config.ADMIN_PASS_SEED;

    server.log.info('Starting database connection...');
    
    mongoose.set('strictQuery', false);
    
    const connection = await mongoose.connect(mongoUri);
    server.log.info('Mongoose connected successfully.');
    
    server.decorate('mongoose', connection);

    const models = {
      User,
      Product,
      Cycle,
    };

    server.decorate('models', models);
    server.log.info('Mongoose models decorated.');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      server.log.info('No users found. Creating default admin...');
      const defaultAdmin = new User({
        email: adminEmailSeed,
        username: adminUserSeed,
        password: adminPassSeed,
        role: 'admin',
        icon: 'graxaim'
      });
      await defaultAdmin.save();
      server.log.info('Default admin created.');
    }

    server.addHook('onClose', async (instance) => {
      await mongoose.disconnect();
      instance.log.info('Mongoose disconnected.');
    });

  } catch (err) {
    server.log.error(err, 'Database plugin initialization error');
    process.exit(1);
  }
};

export default fp(MongoosePlugin);