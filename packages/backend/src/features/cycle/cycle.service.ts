import { Mongoose } from 'mongoose';
import { CreateCycleDTO } from '@elo-organico/shared';
import { CycleRepository } from './cycle.repository';
import { ProductRepository } from '../product/product.repository';
import { UpdateCycleBodyType } from './cycle.schema'; // Import correto

export class CycleService {
  constructor(
    private cycleRepo: CycleRepository,
    private productRepo: ProductRepository,
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
      const bulkOps = data.products.map((p) => ({
        updateOne: {
          filter: { name: p.name },
          update: {
            $set: {
              category: p.category,
              measure: p.measure,
              available: true,
            }
          },
          upsert: true
        }
      }));

      if (bulkOps.length > 0) {
        await this.productRepo.bulkUpsert(bulkOps, session);
      }

      const productNames = data.products.map(p => p.name);
      const activeProducts = await this.productRepo.findByNames(productNames, session);
      const productIds = activeProducts.map(p => p._id);

      await this.productRepo.deactivateOthers(productIds as any[], session);
      await this.cycleRepo.deactivateAll(session);

      const newCycle = await this.cycleRepo.create({
        description: data.description,
        openingDate: new Date(data.openingDate),
        closingDate: new Date(data.closingDate),
        products: productIds,
        isActive: true,
      }, session);

      await session.commitTransaction();
      return {
        message: 'Ciclo criado com sucesso!',
        cycleId: newCycle._id,
        productsCount: productIds.length,
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateCycle(id: string, data: UpdateCycleBodyType) {
    const session = await this.mongoose.startSession();
    session.startTransaction();

    try {
      const currentCycle = await this.cycleRepo.findByIdWithSession(id, session);
      if (!currentCycle) throw new Error('Ciclo não encontrado');

      const updatedProductsList = data.products || [];

      const newProductIds = updatedProductsList
        .map(p => p._id)
        .filter((pid): pid is string => !!pid);
      
      const removedProductIds = currentCycle.products.filter(
          oldId => !newProductIds.includes(oldId.toString())
      );

      if (removedProductIds.length > 0) {
          await this.productRepo.updateMany(
              { _id: { $in: removedProductIds } },
              { $set: { available: false } },
              session
          );
      }

      const bulkOps = updatedProductsList.map((p) => ({
        updateOne: {
          filter: { _id: p._id },
          update: {
            $set: {
              name: p.name,
              category: p.category,
              measure: p.measure,
              available: true,
            }
          }
        }
      }));

      if (bulkOps.length > 0) {
        await this.productRepo.bulkUpsert(bulkOps, session);
      }

      currentCycle.products = newProductIds as any;
      await this.cycleRepo.save(currentCycle, session);

      await session.commitTransaction();
      return this.cycleRepo.findById(id);

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}