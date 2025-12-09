import { RegisterDTOSchema, LoginDTOSchema } from '@elo-organico/shared';

export const registerSchema = {
  body: RegisterDTOSchema,
} as const;

export const loginSchema = {
  body: LoginDTOSchema,
} as const;

export type RegisterRoute = typeof registerSchema;
export type LoginRoute = typeof loginSchema;