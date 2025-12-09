import { FastifyReply, FastifyRequest } from 'fastify';
import { ListProductsQueryType } from './product.schema';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private service: ProductService) {}

  listHandler = async (
    request: FastifyRequest<{ Querystring: ListProductsQueryType }>,
    reply: FastifyReply
  ) => {
    const products = await this.service.listProducts(request.query);
    return reply.send(products);
  }
}