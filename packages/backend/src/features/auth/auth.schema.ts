import { RegisterDTOSchema, LoginDTOSchema } from '@elo-organico/shared';

export const registerSchema = {
  body: RegisterDTOSchema,
};

export const loginSchema = {
  body: LoginDTOSchema,
};