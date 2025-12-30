import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import server from '../config/fastifyInstanceConfig.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedAdmin() {
  const envPath = path.resolve(__dirname, '../../../../.env');
  dotenv.config({ path: envPath });

  server.log.info('🌱 [SEED] Iniciando script de Seed do Admin...');

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    server.log.error('❌ ERRO: MONGO_URI não definida no .env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    server.log.info('✅ Conectado ao MongoDB (Replica Set mode).');

    const userCount = await User.countDocuments();

    if (userCount > 0) {
      server.log.warn('⚠️ Usuários já existem na base. Seed abortado para evitar duplicidade.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const adminUser = process.env.ADMIN_USER_SEED;
    const adminEmail = process.env.ADMIN_EMAIL_SEED;
    const adminPass = process.env.ADMIN_PASS_SEED;

    if (!adminUser || !adminEmail || !adminPass) {
      throw new Error(
        '❌ Variáveis ADMIN_USER_SEED, ADMIN_EMAIL_SEED ou ADMIN_PASS_SEED não definidas.',
      );
    }

    const defaultAdmin = new User({
      email: adminEmail,
      username: adminUser,
      password: adminPass,
      icon: 'quati',
      role: 'admin',
    });

    await defaultAdmin.save();

    server.log.info('--------------------------------------------------');
    server.log.info('✅ USUÁRIO ADMIN CRIADO COM SUCESSO!');
    server.log.info(`👤 Usuário: ${adminUser}`);
    server.log.info(`📧 Email: ${adminEmail}`);
    server.log.info('--------------------------------------------------');
  } catch (error) {
    server.log.error('❌ ERRO DURANTE O SEED:');
    server.log.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    server.log.info('Processo de seed finalizado e conexão encerrada.');
  }
}

void seedAdmin();
