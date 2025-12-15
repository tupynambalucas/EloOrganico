import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model';

async function seedAdmin() {
  const envPath = path.resolve(__dirname, '../../../../.env');
  dotenv.config({ path: envPath });

  console.log('🌱 Iniciando script de Seed do Admin...');

  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ ERRO: MONGO_URI não definida. Verifique seu .env ou variáveis de ambiente.');
    process.exit(1);
  }

  try {
    // 2. Conecta ao Banco
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB.');

    // 3. Verifica se já existem usuários
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('⚠️ Usuários já existem. Seed pulado.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // 4. Cria o Admin
    const adminUser = process.env.ADMIN_USER_SEED;
    const adminEmail = process.env.ADMIN_EMAIL_SEED;
    const adminPass = process.env.ADMIN_PASS_SEED;

    if (!adminUser || !adminEmail || !adminPass) {
        throw new Error('❌ Variáveis de ambiente de SEED (ADMIN_*) não estão definidas.');
    }

    const defaultAdmin = new User({
        email: adminEmail,
        username: adminUser,
        password: adminPass,
        role: 'admin',
        icon: 'graxaim'
    });

    await defaultAdmin.save();
    console.log(`🎉 Admin criado com sucesso! Email: ${adminEmail}`);

  } catch (error) {
    console.error('❌ Erro ao rodar seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();