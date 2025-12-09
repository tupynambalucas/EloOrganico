import { z } from 'zod';
import { AUTH_RULES } from '../constants'; // Importa do arquivo irmão

export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email("Email inválido").max(AUTH_RULES.EMAIL.MAX),
  username: z.string().min(AUTH_RULES.USERNAME.MIN).max(AUTH_RULES.USERNAME.MAX),
  password: z.string().min(AUTH_RULES.PASSWORD.MIN).optional(),
  icon: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type IUser = z.infer<typeof UserSchema>;