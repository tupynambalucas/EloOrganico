import { ProductRepository } from './product.repository';
import { ListProductsQueryType } from './product.schema';

export class ProductService {
  constructor(private repo: ProductRepository) {}

  async listProducts(filters: ListProductsQueryType) {
    const query: any = {};

    if (filters.availableOnly) {
      query.available = true;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return this.repo.findAll(query);
  }
}