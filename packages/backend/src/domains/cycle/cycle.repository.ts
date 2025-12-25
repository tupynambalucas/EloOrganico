import { Model, ClientSession, FilterQuery } from 'mongoose';
import { ICycleDocument } from '../../models/cycle.model.js';
import { ICycleRepository } from './cycle.repository.interface.js';

export class CycleRepository implements ICycleRepository {
  constructor(private model: Model<ICycleDocument>) {}

  async findActive() {
    return this.model.findOne({ isActive: true }).populate('products');
  }

  async findHistory(page: number, limit: number, startDate?: string, endDate?: string) {
    const skip = (page - 1) * limit;
    const query: FilterQuery<ICycleDocument> = {};

    if (startDate || endDate) {
      query.openingDate = {};
      if (startDate) query.openingDate.$gte = new Date(startDate);
      if (endDate) query.openingDate.$lte = new Date(endDate);
    }

    const [cycles, total] = await Promise.all([
      this.model.find(query)
        .select('-products')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(query)
    ]);

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
      { isActive: true, closingDate: { $lte: toleranceDate } }, 
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
    const newCycle = new this.model(data);
    return newCycle.save({ session });
  }

  async save(document: ICycleDocument, session: ClientSession) {
    return document.save({ session });
  }
}