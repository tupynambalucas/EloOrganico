import { FastifySchema } from 'fastify';

export const registerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'username', 'password', 'icon'],
    properties: {
      email: { type: 'string', format: 'email' },
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 6 },
      icon: { type: 'string' }
    }
  }
};

export const loginSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['identifier', 'password'],
    properties: {
      identifier: { type: 'string' },
      password: { type: 'string' }
    }
  }
};