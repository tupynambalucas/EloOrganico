import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCycleDTO } from '@elo-organico/shared';
import { 
  HistoryQueryType, 
  CycleIdParamType, 
  UpdateCycleBodyType 
} from './cycle.schema';

// --- PUBLIC ---
export async function getActiveCycleHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const activeCycle = await Cycle.findOne({ isActive: true }).populate('products');

  if (!activeCycle) {
    return reply.status(204).send(); 
  }

  return reply.send(activeCycle);
}

// --- ADMIN ---
export async function getCycleHistoryHandler(
  request: FastifyRequest<{ Querystring: HistoryQueryType }>, // Tipo inferido
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const { page, limit, startDate, endDate } = request.query;

  const skip = (page - 1) * limit;
  const query: any = { isActive: false };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const cycles = await Cycle.find(query)
    .select('-products')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Cycle.countDocuments(query);

  return reply.send({
    data: cycles,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
}

export async function getCycleByIdHandler(
  request: FastifyRequest<{ Params: CycleIdParamType }>, // Tipo inferido
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const { id } = request.params;

  const cycle = await Cycle.findById(id).populate('products');

  if (!cycle) {
    return reply.status(404).send({ message: 'Ciclo não encontrado' });
  }

  return reply.send(cycle);
}

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

export async function updateCycleHandler(
  request: FastifyRequest<{ Params: CycleIdParamType, Body: UpdateCycleBodyType }>,
  reply: FastifyReply
) {
  const { Product, Cycle } = request.server.models;
  const { mongoose } = request.server;
  const { id } = request.params;
  const { products: updatedProductsList } = request.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const currentCycle = await Cycle.findById(id).session(session);
    if (!currentCycle) {
        throw new Error('Ciclo não encontrado');
    }

    const newProductIds = updatedProductsList
      .map(p => p._id)
      .filter((id): id is string => !!id);
    
    const removedProductIds = currentCycle.products.filter(
        oldId => !newProductIds.includes(oldId.toString())
    );

    if (removedProductIds.length > 0) {
        await Product.updateMany(
            { _id: { $in: removedProductIds } },
            { $set: { available: false } }
        ).session(session);
    }

    const bulkOps = updatedProductsList.map((p) => ({
      updateOne: {
        filter: { _id: p._id as any },
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
      await Product.bulkWrite(bulkOps, { session });
    }

    currentCycle.products = newProductIds as any;
    await currentCycle.save({ session });

    await session.commitTransaction();

    const updatedCycle = await Cycle.findById(id).populate('products');

    return reply.send(updatedCycle);

  } catch (error: any) {
    await session.abortTransaction();
    request.log.error(error);
    return reply.status(500).send({ 
      message: 'Erro ao atualizar ciclo e produtos', 
      error: error.message 
    });
  } finally {
    await session.endSession();
  }
}