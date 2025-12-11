import { ProductService } from './product.service';
import { FastifyZodHandler } from '../../types/fastify';
import { ListProductsRoute } from './product.schema';

export class ProductController {
  constructor(private service: ProductService) {}

  private mapToResponse(product: any) {
    if (!product) return null;

    const obj = typeof product.toObject === 'function' ? product.toObject() : product;
    
    return {
      ...obj,
      _id: obj._id?.toString(),
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
    };
  }

  listHandler: FastifyZodHandler<ListProductsRoute> = async (request, reply) => {
    const products = await this.service.listProducts(request.query);
    const response = products.map(p => this.mapToResponse(p));
    return reply.send(response);
  }
}