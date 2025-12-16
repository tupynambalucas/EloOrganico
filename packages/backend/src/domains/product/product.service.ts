import { ClientSession, FilterQuery, AnyBulkWriteOperation } from 'mongoose';
import { IProduct } from '@elo-organico/shared';
import { IProductRepository } from './product.repository.interface';
import { ListProductsQueryType } from './product.schema';
import { AppError } from '../../utils/AppError';
import { IProductDocument } from '../../models/product.model';

export class ProductService {
  constructor(private repo: IProductRepository) {}

  async listProducts(filters: ListProductsQueryType) {
    const query: FilterQuery<IProductDocument> = {};

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

  async syncCycleProducts(products: IProduct[], session: ClientSession): Promise<string[]> {
    if (!products || products.length === 0) return [];

    try {
      const bulkOps: AnyBulkWriteOperation<IProductDocument>[] = products.map((p) => {
        const filter: FilterQuery<IProductDocument> = { 
          name: p.name, 
          category: p.category,
          'measure.type': p.measure.type 
        };

        if (p.content) {
          filter['content.value'] = p.content.value;
          filter['content.unit'] = p.content.unit;
        } else {
          filter['content'] = null; 
        }

        return {
          updateOne: {
            filter: filter,
            update: {
              $set: {
                name: p.name,
                category: p.category,
                measure: p.measure,
                content: p.content,
                available: true,
              }
            },
            upsert: true
          }
        };
      });

      if (bulkOps.length > 0) {
        await this.repo.bulkUpsert(bulkOps, session);
      }

      const keys = products.map(p => ({ 
        name: p.name, 
        category: p.category,
        measureType: p.measure.type,
        contentValue: p.content?.value,
        contentUnit: p.content?.unit
      }));

      const activeProducts = await this.repo.findByKeys(keys, session);
      const activeIds = activeProducts.map(p => p._id.toString());

      await this.repo.deactivateOthers(activeIds, session);

      return activeIds;

    } catch {
      throw new AppError('PRODUCT_SYNC_FAILED', 500);
    }
  }
}