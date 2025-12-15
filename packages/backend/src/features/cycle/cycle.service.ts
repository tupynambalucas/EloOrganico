import { Mongoose } from 'mongoose';
import { IProduct } from '@elo-organico/shared';
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
    const activeCycle = await this.cycleRepo.findActive();

    if (!activeCycle) return null;

    if (activeCycle.status === 'CLOSED') {
      const session = await this.mongoose.startSession();
      try {
        session.startTransaction();
        
        activeCycle.isActive = false;
        await this.cycleRepo.save(activeCycle, session);
        
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        console.error('Auto-archive cycle error:', err);
      } finally {
        session.endSession();
      }
      return null;
    }

    return activeCycle;
  }

  async getHistory(page: number, limit: number, start?: string, end?: string) {
    const query: any = { isActive: false };
    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }

    const skip = (page - 1) * limit;
    return this.cycleRepo.findHistory(query, skip, limit);
  }

  async getById(id: string) {
    const cycle = await this.cycleRepo.findById(id);
    if (!cycle) {
      throw new AppError('CYCLE_NOT_FOUND', 404);
    }
    return cycle;
  }

  async createCycle(data: any) {
    const activeCycle = await this.cycleRepo.findActive();
    if (activeCycle) {
      throw new AppError('ACTIVE_CYCLE_ALREADY_EXISTS', 409);
    }

    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const productIds = await this.productService.syncCycleProducts(data.products, session);

      const newCycleData = {
        description: data.description,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        products: productIds,
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
      session.endSession();
    }
  }

  async updateCycle(id: string, products: IProduct[]) {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const cycle = await this.cycleRepo.findByIdWithSession(id, session);
      if (!cycle) {
        throw new AppError('CYCLE_NOT_FOUND_FOR_UPDATE', 404);
      }

      const productIds = await this.productService.syncCycleProducts(products, session);

      cycle.products = productIds as any;
      await this.cycleRepo.save(cycle, session);

      await session.commitTransaction();
      
      return await this.cycleRepo.findById(id);
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_UPDATE_FAILED', 400);
    } finally {
      session.endSession();
    }
  }
}