import { z } from 'zod';
import { CreateCycleDTOSchema, ProductSchema, CycleResponseSchema } from '@elo-organico/shared';

export const createCycleSchema = {
  body: CreateCycleDTOSchema,
  response: {
    201: CycleResponseSchema
  }
} as const;

const HistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

const HistoryResponseSchema = z.object({
  data: z.array(CycleResponseSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pages: z.number()
  })
});

export const getHistorySchema = {
  querystring: HistoryQuerySchema,
  response: {
    200: HistoryResponseSchema
  }
} as const;

const CycleIdParamSchema = z.object({
  id: z.string().min(1)
});

export const getCycleByIdSchema = {
  params: CycleIdParamSchema,
  response: {
    200: CycleResponseSchema
  }
} as const;

export const updateCycleSchema = {
  params: CycleIdParamSchema,
  body: z.object({
    products: z.array(ProductSchema)
  }),
  response: {
    200: CycleResponseSchema
  }
} as const;

export type CreateCycleRoute = typeof createCycleSchema;
export type UpdateCycleRoute = typeof updateCycleSchema;
export type GetHistoryRoute = typeof getHistorySchema;
export type GetByIdRoute = typeof getCycleByIdSchema;