import { z } from 'zod';
import { UserSchema, UserResponseSchema } from './user';
import { AUTH_RULES } from '../constants';

export const RegisterDTOSchema = UserSchema.pick({ 
  email: true, 
  username: true, 
  icon: true 
}).extend({
  password: z.string().min(AUTH_RULES.PASSWORD.MIN)
});

export const LoginDTOSchema = z.object({
  identifier: z.string(),
  password: z.string()
});

export const LoginResponseSchema = z.object({
  authenticated: z.boolean(),
  token: z.string(),
  user: UserResponseSchema
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;
export type LoginDTO = z.infer<typeof LoginDTOSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;