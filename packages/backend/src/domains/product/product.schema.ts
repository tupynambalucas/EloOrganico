import { z } from 'zod';
import { ProductResponseSchema } from '@elo-organico/shared';

const ListProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  availableOnly: z.coerce.boolean().optional(),
});

export const listProductsSchema = {
  querystring: ListProductsQuerySchema,
  response: {
    200: z.array(ProductResponseSchema),
  },
} as const;

export interface ListProductsRoute {
  querystring: typeof ListProductsQuerySchema;
  response: {
    200: z.ZodArray<typeof ProductResponseSchema>;
  };
}
