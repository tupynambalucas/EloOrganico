import { z } from 'zod';
import { CreateCycleDTOSchema, ProductSchema } from '@elo-organico/shared';

// --- SCHEMAS (ZOD) ---

// 1. Create (Reusa do Shared)
export const createCycleSchema = {
  body: CreateCycleDTOSchema,
};

// 2. History Query (Filtros)
const HistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export const getHistorySchema = {
  querystring: HistoryQuerySchema
};

const CycleIdParamSchema = z.object({
  id: z.string().min(1, "ID é obrigatório")
});

export const getCycleByIdSchema = {
  params: CycleIdParamSchema
};

export const updateCycleSchema = {
  params: CycleIdParamSchema,
  body: z.object({
    products: z.array(ProductSchema) // Lista completa de produtos
  })
};

export type HistoryQueryType = z.infer<typeof HistoryQuerySchema>;
export type CycleIdParamType = z.infer<typeof CycleIdParamSchema>;
export type UpdateCycleBodyType = z.infer<typeof updateCycleSchema.body>;