import { FastifySchema } from 'fastify';
import { CreateCycleDTOSchema } from '@elo-organico/shared';

// Schema do Body para criação (Mantido)
export const createCycleSchema = {
  body: CreateCycleDTOSchema,
};

// Schema para Query Params do Histórico (Novo)
export const getHistorySchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', default: 1 },
      limit: { type: 'number', default: 10 },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' }
    }
  }
};

// Schema para buscar detalhes por ID (Novo)
export const getCycleByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  }
};