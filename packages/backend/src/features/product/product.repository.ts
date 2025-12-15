import { Model, FilterQuery, ClientSession } from 'mongoose';
import { IProductDocument } from '../../models/product.model';
import { IProductRepository } from './product.repository.interface';

export class ProductRepository implements IProductRepository {
  constructor(private model: Model<IProductDocument>) {}

  async findAll(queryFilters: FilterQuery<IProductDocument>) {
    return this.model.find(queryFilters).sort({ category: 1, name: 1 });
  }

  async bulkUpsert(ops: any[], session: ClientSession) {
    return this.model.bulkWrite(ops, { session });
  }

  async findByKeys(keys: any[], session: ClientSession) {
    if (keys.length === 0) return [];
    
    const criteria = keys.map(k => {
      const filter: any = { 
        name: k.name, 
        category: k.category,
        'measure.type': k.measureType 
      };

      if (k.contentValue !== undefined && k.contentUnit !== undefined) {
        filter['content.value'] = k.contentValue;
        filter['content.unit'] = k.contentUnit;
      } else {
        filter['content'] = null; 
      }
      return filter;
    });

    return this.model.find({ $or: criteria }).select('_id').session(session);
  }

  async deactivateOthers(activeIds: string[], session: ClientSession) {
    return this.model.updateMany(
      { _id: { $nin: activeIds } },
      { $set: { available: false } }
    ).session(session);
  }

  async updateMany(filter: any, update: any, session: ClientSession) {
    return this.model.updateMany(filter, update).session(session);
  }
}