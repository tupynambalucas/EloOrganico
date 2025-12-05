import { FastifyReply, FastifyRequest } from 'fastify';
import type { IProduct } from '@elo-organico/shared';
import type { IProductDocument } from '../../../models/Product';

interface CreateCycleBody {
  products: IProduct[];
  description: string;
  openingDate: string;
  closingDate: string;
}

export async function createCycleHandler(
  request: FastifyRequest<{ Body: CreateCycleBody }>,
  reply: FastifyReply
) {
  const { Product, Cycle } = request.server.models;
  const { products: incomingProducts, description, openingDate, closingDate } = request.body;

  try {
    const productProcessingPromises = incomingProducts.map(productData => {
      return Product.findOneAndUpdate(
        { name: productData.name },
        { 
          $set: {
            category: productData.category, 
            measure: productData.measure,
            available: true,
          } 
        },
        { new: true, upsert: true, runValidators: true }
      );
    });

    const savedProducts = await Promise.all(productProcessingPromises);
    
    const productIds = savedProducts
      .map((p) => (p as IProductDocument)?._id)
      .filter(Boolean);
    
    await Product.updateMany(
      { _id: { $nin: productIds } },
      { $set: { available: false } }
    );

    await Cycle.deleteMany({ isActive: true });

    const newCycle = new Cycle({
      description,
      openingDate: new Date(openingDate),
      closingDate: new Date(closingDate),
      products: productIds,
      isActive: true,
    });

    await newCycle.save();

    return reply.status(201).send({
      message: 'Ciclo criado com sucesso!',
      cycleId: newCycle._id,
      productsCount: productIds.length,
    });

  } catch (error: any) {
    request.log.error(error, 'Erro ao criar ciclo');
    return reply.status(500).send({ message: 'Erro interno ao processar ciclo', error: error.message });
  }
}