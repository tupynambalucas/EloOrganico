import { FastifyReply, FastifyRequest } from 'fastify';
import { ListProductsQueryType } from './products.schema';

export async function listProductsHandler(
  request: FastifyRequest<{ Querystring: ListProductsQueryType }>,
  reply: FastifyReply
) {
  const { Product } = request.server.models;
  const { search, category, availableOnly } = request.query;

  const query: any = {};

  if (availableOnly) {
    query.available = true;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(query).sort({ category: 1, name: 1 });
  
  return reply.send(products);
}