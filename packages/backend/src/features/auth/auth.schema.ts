import { z } from 'zod';
import { RegisterDTOSchema, LoginDTOSchema, LoginResponseSchema } from '@elo-organico/shared';

export const registerSchema = {
  body: RegisterDTOSchema,
  response: {
    201: z.object({ message: z.string() })
  }
} as const;

export const loginSchema = {
  body: LoginDTOSchema,
  response: {
    200: LoginResponseSchema
  }
} as const;

export type RegisterRoute = typeof registerSchema;
export type LoginRoute = typeof loginSchema;