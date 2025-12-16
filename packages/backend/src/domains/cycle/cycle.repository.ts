import { Model, ClientSession, FilterQuery } from 'mongoose';
import { ICycleDocument } from '../../models/cycle.model';
import { ICycleRepository } from './cycle.repository.interface';

export class CycleRepository implements ICycleRepository {
  constructor(private model: Model<ICycleDocument>) {}

  async findActive() {
    return this.model.findOne({ isActive: true }).populate('products');
  }

  async findHistory(query: FilterQuery<ICycleDocument>, skip: number, limit: number) {
    const cycles = await this.model.find(query)
      .select('-products')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await this.model.countDocuments(query);
    return { cycles, total };
  }

  async findById(id: string) {
    return this.model.findById(id).populate('products');
  }

  async findByIdWithSession(id: string, session: ClientSession) {
    return this.model.findById(id).session(session);
  }

  async archiveExpired(toleranceDate: Date, session?: ClientSession) {
    return this.model.updateMany(
      { 
        isActive: true, 
        closingDate: { $lte: toleranceDate } 
      }, 
      { $set: { isActive: false } }
    ).session(session || null);
  }

  async deactivateAll(session: ClientSession) {
    return this.model.updateMany(
      { isActive: true }, 
      { $set: { isActive: false } }
    ).session(session);
  }

  async create(data: Partial<ICycleDocument>, session: ClientSession) {
    const cycle = new this.model(data);
    return cycle.save({ session });
  }

  async save(document: ICycleDocument, session: ClientSession) {
    return document.save({ session });
  }
}