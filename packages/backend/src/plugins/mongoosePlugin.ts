import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Cycle } from '../models/Cycle';

const MongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    const mongoUri = server.config.MONGO_URI;
    console.log('MONGO_URI:', mongoUri); // Log para depuração
    // Pegamos as variáveis de ambiente (Seed)
    const adminUserSeed = server.config.ADMIN_USER_SEED;
    const adminEmailSeed = server.config.ADMIN_EMAIL_SEED;
    const adminPassSeed = server.config.ADMIN_PASS_SEED;

    server.log.info('🔌 Starting database connection...');
    
  
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

    // --- Lógica de Criação do Admin Padrão ---
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      server.log.info('👤 No users found. Creating default admin...');
      
      // Validação rápida de segurança para não quebrar o schema do Zod/Mongoose
      if (adminPassSeed.length < 6) {
        throw new Error('❌ ERRO CRÍTICO: ADMIN_PASS_SEED no .env deve ter no mínimo 6 caracteres.');
      }

      const defaultAdmin = new User({
        email: adminEmailSeed,
        username: adminUserSeed,
        password: adminPassSeed, // O Hook pre-save do User.ts vai hashear isso automaticamente
        role: 'admin',
        icon: 'graxaim'
      });

      await defaultAdmin.save();
      server.log.info(`🎉 Default admin created: ${adminEmailSeed}`);
    }

    server.addHook('onClose', async (instance) => {
      await mongoose.disconnect();
      instance.log.info('👋 Mongoose disconnected.');
    });

  } catch (err) {
    server.log.error(err, '❌ Database plugin initialization error');
    process.exit(1);
  }
};

export default fp(MongoosePlugin);