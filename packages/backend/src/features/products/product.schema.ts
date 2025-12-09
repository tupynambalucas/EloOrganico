import { z } from 'zod';

const ListProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  availableOnly: z.coerce.boolean().optional() // coerce.boolean converte "true"/"false" string para boolean
});

export const listProductsSchema = {
  querystring: ListProductsQuerySchema
};

export type ListProductsQueryType = z.infer<typeof ListProductsQuerySchema>;