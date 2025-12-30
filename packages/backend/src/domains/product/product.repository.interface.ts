import type {
  FilterQuery,
  ClientSession,
  AnyBulkWriteOperation,
  UpdateWriteOpResult,
  UpdateQuery,
  mongo,
} from 'mongoose';
import type { IProductDocument } from '../../models/product.model.js';

export interface ProductKey {
  name: string;
  category: string;
  measureType: string;
  contentValue?: number;
  contentUnit?: string;
}

export interface IProductRepository {
  findAll(queryFilters: FilterQuery<IProductDocument>): Promise<IProductDocument[]>;
  bulkUpsert(
    ops: Array<AnyBulkWriteOperation<IProductDocument>>,
    session: ClientSession,
  ): Promise<mongo.BulkWriteResult>;
  findByKeys(keys: ProductKey[], session: ClientSession): Promise<IProductDocument[]>;
  deactivateOthers(activeIds: string[], session: ClientSession): Promise<UpdateWriteOpResult>;
  updateMany(
    filter: FilterQuery<IProductDocument>,
    update: UpdateQuery<IProductDocument>,
    session: ClientSession,
  ): Promise<UpdateWriteOpResult>;
}
