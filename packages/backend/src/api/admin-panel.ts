import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions } from 'fastify';
import { type IProduct, type IProductDocument } from '../models/Product.js';

interface SharingCreateBody {
  products: IProduct[];
  description: string;
  openingDate: string; // Vem como string JSON, será convertida para Date
  closingDate: string; // Vem como string JSON, será convertida para Date
}
const AdminPanelRoute: FastifyPluginAsync = async (server: FastifyInstance, opts: FastifyPluginOptions) => {

  server.post('/sharing-create', async (request, reply) => {
    try {
      const { Product, Cycle } = server.models;
      const { products: incomingProducts, description, openingDate, closingDate } = request.body as SharingCreateBody;

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
          { 
            new: true,
            upsert: true,
            runValidators: true,
          }
        );
      });

      const savedProducts = await Promise.all(productProcessingPromises);
      const productIds = savedProducts
        .map((p: IProductDocument | null) => p?._id)
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
        message: 'Ciclo de partilha criado com sucesso!',
        cycleId: newCycle._id,
        productsProcessed: productIds.length,
      });

    } catch (error: any) {
      server.log.error(error, 'Erro ao criar o ciclo de partilha');
      return reply.status(500).send({ message: 'Erro interno do servidor', error: error.message });
    }
  });

  server.post('/login', async (request, reply) => {

  });

  server.post('/logout', async (request, reply) => {

  });
};

// CORRECTED: Export the plugin directly without wrapping it in fp.
export default AdminPanelRoute;