import { Mongoose } from 'mongoose';
import { CreateCycleDTO, IProduct } from '@elo-organico/shared';
import { CycleRepository } from './cycle.repository';
import { ProductService } from '../product/product.service';

export class CycleService {
  constructor(
    private cycleRepo: CycleRepository,
    private productService: ProductService,
    private mongoose: Mongoose
  ) {}

  async getActive() {
    return this.cycleRepo.findActive();
  }

  async getHistory(page: number, limit: number, start?: string, end?: string) {
    const query: any = { isActive: false };
    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }
    return this.cycleRepo.findHistory(query, (page - 1) * limit, limit);
  }

  async getById(id: string) {
    const cycle = await this.cycleRepo.findById(id);
    if (!cycle) throw new Error('Ciclo não encontrado');
    return cycle;
  }

  async createCycle(data: CreateCycleDTO) {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      await this.cycleRepo.deactivateAll(session);

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
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateCycle(id: string, products: IProduct[]) {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const cycle = await this.cycleRepo.findByIdWithSession(id, session);
      if (!cycle) throw new Error('Ciclo não encontrado');

      const productIds = await this.productService.syncCycleProducts(products, session);

      cycle.products = productIds as any;
      await this.cycleRepo.save(cycle, session);

      await session.commitTransaction();
      
      const updatedCycle = await this.cycleRepo.findById(id);
      return updatedCycle;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}