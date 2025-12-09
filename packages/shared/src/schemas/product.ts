import { z } from 'zod';

// Sub-schema auxiliar
export const MeasureSchema = z.object({
  value: z.union([z.string(), z.number()]),
  type: z.string(),
  minimumOrder: z.object({
    type: z.string(),
    value: z.union([z.string(), z.number()])
  }).optional()
});

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  measure: MeasureSchema,
  available: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Inferência de Tipos
export type IMeasure = z.infer<typeof MeasureSchema>;
export type IProduct = z.infer<typeof ProductSchema>;