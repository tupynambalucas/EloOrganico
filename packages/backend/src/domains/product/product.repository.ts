import { Model, FilterQuery, ClientSession, AnyBulkWriteOperation, UpdateQuery } from 'mongoose';
import { IProductDocument } from '../../models/product.model';
import { IProductRepository, ProductKey } from './product.repository.interface';

export class ProductRepository implements IProductRepository {
  constructor(private model: Model<IProductDocument>) {}

  async findAll(queryFilters: FilterQuery<IProductDocument>) {
    return this.model.find(queryFilters).sort({ category: 1, name: 1 });
  }

  async bulkUpsert(ops: AnyBulkWriteOperation<IProductDocument>[], session: ClientSession) {
    return this.model.bulkWrite(ops, { session });
  }

  async findByKeys(keys: ProductKey[], session: ClientSession) {
    if (keys.length === 0) return [];
    
    const criteria = keys.map(k => {
      const filter: FilterQuery<IProductDocument> = { 
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
      { _id: { $nin: activeIds }, available: true },
      { $set: { available: false } }
    ).session(session);
  }

  async updateMany(filter: FilterQuery<IProductDocument>, update: UpdateQuery<IProductDocument>, session: ClientSession) {
    return this.model.updateMany(filter, update).session(session);
  }
}