import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose, { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; // 1. Import
import { type IUser, type IUserDocument, userSchema } from '../models/User.js';
import { type IProduct, type IProductDocument, productSchema } from '../models/Product.js';
import { type ICycle, type ICycleDocument, cycleSchema } from '../models/Cycle.js';

const MongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 2. Declare mongod variable
  let mongod: MongoMemoryServer | undefined;

  try {
    let mongoUri = server.config.MONGO_URI as string;

    // 3. Conditionally start in-memory server
    if (process.env.NODE_ENV === 'development') {
      server.log.info('Development mode. Starting in-memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri(); // Override the URI
      server.log.info(`In-memory server running at: ${mongoUri}`);
    }

    server.log.info('Starting database connection...');
    
    // --- PASSO A: CONECTA AO BANCO DE DADOS ---
    mongoose.set('strictQuery', false);
    // 4. Use the dynamic mongoUri
    const connection = await mongoose.connect(mongoUri);
    server.log.info('Mongoose connected successfully.');
    
    server.decorate('mongoose', connection);

    // --- PASSO B: CRIA OS MODELOS (SÓ ACONTECE APÓS A CONEXÃO) ---
    const models = {
      User: connection.model<IUserDocument>('User', userSchema),
      Product: connection.model<IProductDocument>('Product', productSchema),
      Cycle: connection.model<ICycleDocument>('Cycle', cycleSchema),
    };
    server.log.info('Mongoose models registered.');

    server.decorate('models', models);

    // --- PASSO C: EXECUTA LÓGICA DE INICIALIZAÇÃO ---
    const { User } = server.models;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      server.log.info('No users found. Creating default admin...');
      const defaultAdmin = new User({
        email: 'admin@admin.com',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        icon: 'graxaim'
      });
      await defaultAdmin.save();
      server.log.info('Default admin created.');
    }

    // --- PASSO D: CONFIGURA O HOOK DE ENCERRAMENTO ---
    server.addHook('onClose', async (instance) => {
      await instance.mongoose.disconnect();
      instance.log.info('Mongoose disconnected.');

      // 5. Stop the in-memory server if it exists
      if (mongod) {
        await mongod.stop();
        instance.log.info('In-memory MongoDB server stopped.');
      }
    });

  } catch (err) {
    server.log.error(err, 'Database plugin initialization error');
    // Stop the in-memory server on a failed startup
    if (mongod) {
      await mongod.stop();
    }
    process.exit(1);
  }
};

export default fp(MongoosePlugin);