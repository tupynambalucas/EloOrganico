import { Mongoose } from 'mongoose';
import { CreateCycleDTO, IProduct } from '@elo-organico/shared';
import { CycleRepository } from './cycle.repository';
import { ProductService } from '../product/product.service';
import { AppError } from '../../utils/AppError';

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
    if (!cycle) {
      throw new AppError('O ciclo solicitado não foi encontrado.', 404);
    }
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
      if (error instanceof AppError) throw error;
      throw new AppError('Não foi possível iniciar o ciclo. Verifique os dados enviados.', 400);
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
        throw new AppError('Ciclo não encontrado para atualização.', 404);
      }

      const productIds = await this.productService.syncCycleProducts(products, session);

      cycle.products = productIds as any;
      await this.cycleRepo.save(cycle, session);

      await session.commitTransaction();
      
      return await this.cycleRepo.findById(id);
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar o ciclo.', 400);
    } finally {
      session.endSession();
    }
  }
}