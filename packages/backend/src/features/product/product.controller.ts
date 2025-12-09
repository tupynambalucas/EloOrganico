import { ProductService } from './product.service';
import { FastifyZodHandler } from '../../types/fastify';
import { ListProductsRoute } from './product.schema';

export class ProductController {
  constructor(private service: ProductService) {}

  listHandler: FastifyZodHandler<ListProductsRoute> = async (request, reply) => {
    const products = await this.service.listProducts(request.query);
    return reply.send(products);
  }
}