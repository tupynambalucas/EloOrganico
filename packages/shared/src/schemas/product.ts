import { z } from 'zod';

export const MeasureSchema = z.object({
  value: z.union([z.string(), z.number()]),
  type: z.string(),
  minimumOrder: z.object({
    type: z.string(),
    value: z.union([z.string(), z.number()])
  }).optional()
});

export const ContentSchema = z.object({
  value: z.number(),
  unit: z.enum(['g', 'kg', 'ml', 'L'])
});

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  measure: MeasureSchema,
  // Novo campo adicionado
  content: ContentSchema.optional(),
  available: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type IMeasure = z.infer<typeof MeasureSchema>;
export type IContent = z.infer<typeof ContentSchema>;
export type IProduct = z.infer<typeof ProductSchema>;