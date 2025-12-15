import { FilterQuery, ClientSession } from 'mongoose';
import { IProductDocument } from '../../models/product.model';

export interface IProductRepository {
  findAll(queryFilters: FilterQuery<IProductDocument>): Promise<IProductDocument[]>;
  bulkUpsert(ops: any[], session: ClientSession): Promise<any>;
  findByKeys(keys: any[], session: ClientSession): Promise<IProductDocument[]>;
  deactivateOthers(activeIds: string[], session: ClientSession): Promise<any>;
  updateMany(filter: any, update: any, session: ClientSession): Promise<any>;
}