import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model';

async function seedAdmin() {
  // 1. Configuração do ambiente
  const envPath = path.resolve(__dirname, '../../../../.env');
  dotenv.config({ path: envPath });

  console.log('🌱 [SEED] Iniciando script de Seed do Admin...');

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ ERRO: MONGO_URI não definida no .env.');
    process.exit(1);
  }

  try {
    // 2. Conecta ao Banco com opções para Replica Set
    // serverSelectionTimeoutMS: dá tempo para o Docker eleger o Primary antes de falhar
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Conectado ao MongoDB (Replica Set mode).');

    // 3. Verifica se já existem usuários
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      console.log('⚠️ Usuários já existem na base. Seed abortado para evitar duplicidade.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // 4. Recupera dados do .env
    const adminUser = process.env.ADMIN_USER_SEED;
    const adminEmail = process.env.ADMIN_EMAIL_SEED;
    const adminPass = process.env.ADMIN_PASS_SEED;

    if (!adminUser || !adminEmail || !adminPass) {
      throw new Error('❌ Variáveis ADMIN_USER_SEED, ADMIN_EMAIL_SEED ou ADMIN_PASS_SEED não definidas.');
    }

    // 5. Cria o Admin
    // Em um Replica Set, o Mongoose automaticamente enviará isso para o nó PRIMARY
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
    // 6. Fecha a conexão sempre
    await mongoose.disconnect();
    console.log('processo de seed finalizado e conexão encerrada.');
  }
}

// Executa o script
seedAdmin();