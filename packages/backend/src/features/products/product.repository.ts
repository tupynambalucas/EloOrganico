import { Model, FilterQuery, ClientSession } from 'mongoose';
import { IProductDocument } from '../../models/Product';

export class ProductRepository {
  constructor(private model: Model<IProductDocument>) {}

  async findAll(queryFilters: FilterQuery<IProductDocument>) {
    return this.model.find(queryFilters).sort({ category: 1, name: 1 });
  }

  async bulkUpsert(ops: any[], session: ClientSession) {
    return this.model.bulkWrite(ops, { session });
  }

  async findByNames(names: string[], session: ClientSession) {
    return this.model.find({ name: { $in: names } }).select('_id').session(session);
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