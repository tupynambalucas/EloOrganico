import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model.js';

async function seedAdmin() {
  const envPath = path.resolve(__dirname, '../../../../.env');
  dotenv.config({ path: envPath });

  console.log('🌱 [SEED] Iniciando script de Seed do Admin...');

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ ERRO: MONGO_URI não definida no .env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Conectado ao MongoDB (Replica Set mode).');

    const userCount = await User.countDocuments();

    if (userCount > 0) {
      console.log('⚠️ Usuários já existem na base. Seed abortado para evitar duplicidade.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const adminUser = process.env.ADMIN_USER_SEED;
    const adminEmail = process.env.ADMIN_EMAIL_SEED;
    const adminPass = process.env.ADMIN_PASS_SEED;

    if (!adminUser || !adminEmail || !adminPass) {
      throw new Error('❌ Variáveis ADMIN_USER_SEED, ADMIN_EMAIL_SEED ou ADMIN_PASS_SEED não definidas.');
    }

    const defaultAdmin = new User({
      email: adminEmail,
      username: adminUser,
      password: adminPass,
      icon: "quati",
      role: 'admin',
    });

    await defaultAdmin.save();

    console.log('--------------------------------------------------');
    console.log('✅ USUÁRIO ADMIN CRIADO COM SUCESSO!');
    console.log(`👤 Usuário: ${adminUser}`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ ERRO DURANTE O SEED:');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('processo de seed finalizado e conexão encerrada.');
  }
}

// Executa o script
seedAdmin();