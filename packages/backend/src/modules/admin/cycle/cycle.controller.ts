import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCycleDTO } from '@elo-organico/shared';

export async function createCycleHandler(
  request: FastifyRequest<{ Body: CreateCycleDTO }>,
  reply: FastifyReply
) {
  const { Product, Cycle } = request.server.models;
  const { mongoose } = request.server;
  const { products: incomingProducts, description, openingDate, closingDate } = request.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bulkOps = incomingProducts.map((p) => ({
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
      await Product.bulkWrite(bulkOps, { session });
    }

    const productNames = incomingProducts.map(p => p.name);
    const activeProducts = await Product.find({ name: { $in: productNames } })
      .select('_id')
      .session(session);

    const productIds = activeProducts.map(p => p._id);

    await Product.updateMany(
      { _id: { $nin: productIds } },
      { $set: { available: false } }
    ).session(session);

    await Cycle.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    ).session(session);

    const newCycle = new Cycle({
      description,
      openingDate: new Date(openingDate),
      closingDate: new Date(closingDate),
      products: productIds,
      isActive: true,
    });

    await newCycle.save({ session });

    await session.commitTransaction();

    return reply.status(201).send({
      message: 'Ciclo criado com sucesso!',
      cycleId: newCycle._id,
      productsCount: productIds.length,
    });

  } catch (error: any) {
    await session.abortTransaction();
    request.log.error(error);
    return reply.status(500).send({ 
      message: 'Erro interno ao processar ciclo', 
      error: error.message 
    });
  } finally {
    await session.endSession();
  }
}