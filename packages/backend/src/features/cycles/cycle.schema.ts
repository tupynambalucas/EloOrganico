import { z } from 'zod';
import { CreateCycleDTOSchema, ProductSchema } from '@elo-organico/shared';

// --- SCHEMAS (ZOD) ---

// Importante: 'as const' ajuda o Fastify a inferir tipos literais corretamente
export const createCycleSchema = {
  body: CreateCycleDTOSchema,
} as const;

const HistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export const getHistorySchema = {
  querystring: HistoryQuerySchema
} as const;

const CycleIdParamSchema = z.object({
  id: z.string().min(1, "ID é obrigatório")
});

export const getCycleByIdSchema = {
  params: CycleIdParamSchema
} as const;

export const updateCycleSchema = {
  params: CycleIdParamSchema,
  body: z.object({
    products: z.array(ProductSchema)
  })
} as const;

// --- TIPOS INFERIDOS (Single Source of Truth) ---
// O Controller DEVE usar estes tipos para casar com a rota
export type CreateCycleRoute = typeof createCycleSchema;
export type CreateCycleBodyType = z.infer<typeof createCycleSchema.body>;

export type UpdateCycleRoute = typeof updateCycleSchema;
export type UpdateCycleBodyType = z.infer<typeof updateCycleSchema.body>;
export type UpdateCycleParamsType = z.infer<typeof updateCycleSchema.params>;

export type GetHistoryRoute = typeof getHistorySchema;
export type HistoryQueryType = z.infer<typeof getHistorySchema.querystring>;

export type GetByIdRoute = typeof getCycleByIdSchema;
export type CycleIdParamType = z.infer<typeof getCycleByIdSchema.params>;