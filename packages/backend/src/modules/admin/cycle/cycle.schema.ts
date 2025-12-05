import { FastifySchema } from 'fastify';

export const createCycleSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['products', 'openingDate', 'closingDate'],
    properties: {
      description: { type: 'string' },
      openingDate: { type: 'string', format: 'date-time' },
      closingDate: { type: 'string', format: 'date-time' },
      products: { 
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'category', 'measure'],
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            measure: {
              type: 'object',
              required: ['value', 'type'],
              properties: {
                value: { type: ['number', 'string'] },
                type: { type: 'string' },
                minimumOrder: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    value: { type: ['number', 'string'] }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};