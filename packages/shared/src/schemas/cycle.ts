import { z } from 'zod';
import { ProductSchema } from './product';

export const CycleSchema = z.object({
  _id: z.string().optional(),
  description: z.string(),
  openingDate: z.string().datetime(),
  closingDate: z.string().datetime(),
  isActive: z.boolean().default(true),
  // Pode conter IDs (string) ou Produtos populados
  products: z.array(z.union([z.string(), ProductSchema])),
});

// DTO Específico para Criação (Payload que vem do Front)
export const CreateCycleDTOSchema = z.object({
  description: z.string(),
  openingDate: z.string().datetime(),
  closingDate: z.string().datetime(),
  // Na criação, o Front envia a lista completa de produtos para upsert
  products: z.array(ProductSchema) 
});

export type ICycle = z.infer<typeof CycleSchema>;
export type CreateCycleDTO = z.infer<typeof CreateCycleDTOSchema>;