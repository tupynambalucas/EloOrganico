import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCycleDTO } from '@elo-organico/shared';

// Interfaces locais para Query Params
interface HistoryQuery {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

interface ParamsId {
  id: string;
}

// --- PUBLIC: Pega ciclo ativo ---
export async function getActiveCycleHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const activeCycle = await Cycle.findOne({ isActive: true });

  // Se não tiver ciclo, retorna 204 (No Content) ou null, para o front saber que deve abrir o form
  if (!activeCycle) {
    return reply.status(204).send(); 
  }

  return reply.send(activeCycle);
}

// --- ADMIN: Histórico Otimizado ---
export async function getCycleHistoryHandler(
  request: FastifyRequest<{ Querystring: HistoryQuery }>,
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const { page, limit, startDate, endDate } = request.query;

  const skip = (page - 1) * limit;
  
  // Filtro base: apenas inativos
  const query: any = { isActive: false };

  // Filtro de data (Se fornecido)
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Busca Otimizada: Removemos 'products' da resposta para ficar leve
  const cycles = await Cycle.find(query)
    .select('-products') // <--- A Mágica de Performance
    .sort({ createdAt: -1 }) // Mais recentes primeiro
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

// --- ADMIN: Detalhes de um Ciclo ---
export async function getCycleByIdHandler(
  request: FastifyRequest<{ Params: ParamsId }>,
  reply: FastifyReply
) {
  const { Cycle } = request.server.models;
  const { id } = request.params;

  // Aqui populamos os produtos pois o admin clicou para ver detalhes
  const cycle = await Cycle.findById(id).populate('products');

  if (!cycle) {
    return reply.status(404).send({ message: 'Ciclo não encontrado' });
  }

  return reply.send(cycle);
}

// --- ADMIN: Criar Ciclo (Mantido) ---
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

    // 1. Upsert Products (BulkWrite)
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

    // 2. Get Product IDs
    const productNames = incomingProducts.map(p => p.name);
    const activeProducts = await Product.find({ name: { $in: productNames } })
      .select('_id')
      .session(session);

    const productIds = activeProducts.map(p => p._id);

    // 3. Update Availability
    await Product.updateMany(
      { _id: { $nin: productIds } },
      { $set: { available: false } }
    ).session(session);

    // 4. Close any existing active cycle (Safety net)
    await Cycle.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    ).session(session);

    // 5. Create new cycle
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