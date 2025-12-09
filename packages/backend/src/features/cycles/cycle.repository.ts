import { Model, ClientSession } from 'mongoose';
import { ICycleDocument } from '../../models/Cycle';

export class CycleRepository {
  constructor(private model: Model<ICycleDocument>) {}

  async findActive() {
    return this.model.findOne({ isActive: true }).populate('products');
  }

  async findHistory(query: any, skip: number, limit: number) {
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

  async deactivateAll(session: ClientSession) {
    return this.model.updateMany(
      { isActive: true }, 
      { $set: { isActive: false } }
    ).session(session);
  }

  async create(data: any, session: ClientSession) {
    const cycle = new this.model(data);
    return cycle.save({ session });
  }

  async save(document: ICycleDocument, session: ClientSession) {
    return document.save({ session });
  }
}