import { z } from 'zod';

const ListProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  availableOnly: z.coerce.boolean().optional()
});

export const listProductsSchema = {
  querystring: ListProductsQuerySchema
} as const; 

export type ListProductsRoute = typeof listProductsSchema;
export type ListProductsQueryType = z.infer<typeof ListProductsQuerySchema>;