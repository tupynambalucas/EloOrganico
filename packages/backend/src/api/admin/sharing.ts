import { FastifyPluginAsync } from 'fastify';
// CORREÇÃO: Importando a interface do pacote compartilhado
import type { IProduct } from '@elo-organico/shared';

interface SharingCreateBody {
  products: IProduct[];
  description: string;
  openingDate: string;
  closingDate: string;
}

const SharingRoutes: FastifyPluginAsync = async (server) => {
  
  server.post('/sharing', async (request, reply) => {
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
      
      // O TypeScript infere o tipo de 'p' automaticamente baseado no server.models.Product
      const productIds = savedProducts
        .map((p) => p?._id)
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
        productsCount: productIds.length,
      });

    } catch (error: any) {
      server.log.error(error, 'Erro ao criar o ciclo de partilha');
      return reply.status(500).send({ message: 'Erro interno do servidor', error: error.message });
    }
  });
};

export default SharingRoutes;