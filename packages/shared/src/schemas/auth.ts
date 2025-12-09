import { z } from 'zod';
import { UserSchema } from './user';
import { AUTH_RULES } from '../constants';

// Registro: Pegamos campos do User e tornamos password obrigatório
export const RegisterDTOSchema = UserSchema.pick({ 
  email: true, 
  username: true, 
  icon: true 
}).extend({
  password: z.string().min(AUTH_RULES.PASSWORD.MIN)
});

// Login: Apenas identificador e senha
export const LoginDTOSchema = z.object({
  identifier: z.string(),
  password: z.string()
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;
export type LoginDTO = z.infer<typeof LoginDTOSchema>;