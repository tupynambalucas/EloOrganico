import { Mongoose, Types } from 'mongoose';
import { IProduct, CreateCycleDTO } from '@elo-organico/shared';
import { ICycleRepository } from './cycle.repository.interface';
import { ProductService } from '../product/product.service'; 
import { AppError } from '../../utils/AppError';

export class CycleService {
  constructor(
    private cycleRepo: ICycleRepository,
    private productService: ProductService,
    private mongoose: Mongoose
  ) {}

  async getActive() {
    return await this.cycleRepo.findActive();
  }

  async performScheduledArchival() {
    const session = await this.mongoose.startSession();
    try {
      session.startTransaction();
      const toleranceDate = new Date();
      toleranceDate.setDate(toleranceDate.getDate() - 2);
      const result = await this.cycleRepo.archiveExpired(toleranceDate, session);
      await session.commitTransaction();
      return result.modifiedCount;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getHistory(page: number, limit: number, startDate?: string, endDate?: string) {
    return await this.cycleRepo.findHistory(page, limit, startDate, endDate);
  }

  async getById(id: string) {
    const cycle = await this.cycleRepo.findById(id);
    if (!cycle) throw new AppError('CYCLE_NOT_FOUND', 404);
    return cycle;
  }

  async createCycle(data: CreateCycleDTO) {
    const active = await this.cycleRepo.findActive();
    if (active) throw new AppError('ACTIVE_CYCLE_ALREADY_EXISTS', 400);

    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const productIds = await this.productService.syncCycleProducts(data.products, session);
      
      const newCycleData = {
        description: data.description,
        openingDate: new Date(data.openingDate),
        closingDate: new Date(data.closingDate),
        products: productIds.map(id => new Types.ObjectId(id)),
        isActive: true
      };

      const createdCycle = await this.cycleRepo.create(newCycleData, session);
      await session.commitTransaction();
      return createdCycle;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_CREATION_FAILED', 400);
    } finally {
      await session.endSession();
    }
  }

  async updateCycle(id: string, products: IProduct[]) {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const cycle = await this.cycleRepo.findByIdWithSession(id, session);
      if (!cycle) throw new AppError('CYCLE_NOT_FOUND_FOR_UPDATE', 404);

      const productIds = await this.productService.syncCycleProducts(products, session);
      cycle.products = productIds.map(pid => new Types.ObjectId(pid));
      
      await this.cycleRepo.save(cycle, session);
      await session.commitTransaction();
      return await this.cycleRepo.findById(id);
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_UPDATE_FAILED', 400);
    } finally {
      await session.endSession();
    }
  }
}