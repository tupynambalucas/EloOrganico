import { Mongoose, FilterQuery, Types } from 'mongoose';
import { IProduct, CreateCycleDTO } from '@elo-organico/shared';
import { ICycleRepository } from './cycle.repository.interface';
import { ProductService } from '../product/product.service'; 
import { AppError } from '../../utils/AppError';
import { ICycleDocument } from '../../models/cycle.model';

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

      if (result.modifiedCount > 0) {
        console.log(`[Scheduler] Ciclos arquivados: ${result.modifiedCount}`);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error('[Scheduler Error] Falha ao arquivar:', error);
    } finally {
      await session.endSession();
    }
  }

  async getHistory(page: number, limit: number, start?: string, end?: string) {
    const query: FilterQuery<ICycleDocument> = { isActive: false };
    
    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }

    return this.cycleRepo.findHistory(query, (page - 1) * limit, limit);
  }

  async getById(id: string) {
    const cycle = await this.cycleRepo.findById(id);
    if (!cycle) throw new AppError('CYCLE_NOT_FOUND', 404);
    return cycle;
  }

  async createCycle(data: CreateCycleDTO) {
    const activeCycle = await this.cycleRepo.findActive();
    if (activeCycle) {
      throw new AppError('ACTIVE_CYCLE_ALREADY_EXISTS', 409);
    }

    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const productIds = await this.productService.syncCycleProducts(data.products, session);

      const newCycleData: Partial<ICycleDocument> = {
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
      console.error('[CreateCycle Error]:', error);

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
      if (!cycle) {
        throw new AppError('CYCLE_NOT_FOUND_FOR_UPDATE', 404);
      }

      const productIds = await this.productService.syncCycleProducts(products, session);

      cycle.products = productIds.map(pid => new Types.ObjectId(pid));
      
      await this.cycleRepo.save(cycle, session);

      await session.commitTransaction();
      
      return await this.cycleRepo.findById(id);
    } catch (error) {
      await session.abortTransaction();
      console.error('[UpdateCycle Error]:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('CYCLE_UPDATE_FAILED', 400);
    } finally {
      await session.endSession();
    }
  }
}