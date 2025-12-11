import { Model, FilterQuery, ClientSession } from 'mongoose';
import { IProductDocument } from '../../models/Product';

export class ProductRepository {
  constructor(private model: Model<IProductDocument>) {}

  async findAll(queryFilters: FilterQuery<IProductDocument>) {
    return this.model.find(queryFilters).sort({ category: 1, name: 1 });
  }

  async bulkUpsert(ops: any[], session: ClientSession) {
    return this.model.bulkWrite(ops, { session });
  }

  // NOVO MÉTODO: Busca precisa por chaves compostas
  // Localiza produtos que batem exatamente com a assinatura do frontend
  async findByKeys(keys: any[], session: ClientSession) {
    if (keys.length === 0) return [];
    
    // Constrói uma query OR complexa
    const criteria = keys.map(k => {
      const filter: any = { 
        name: k.name, 
        category: k.category,
        'measure.type': k.measureType 
      };

      // Se o produto tem conteúdo (ex: 500g), busca exato.
      // Se não tem (null), busca onde o campo é null no banco.
      if (k.contentValue !== undefined && k.contentUnit !== undefined) {
        filter['content.value'] = k.contentValue;
        filter['content.unit'] = k.contentUnit;
      } else {
        filter['content'] = null; 
      }
      return filter;
    });

    return this.model.find({ $or: criteria }).select('_id').session(session);
  }

  async deactivateOthers(activeIds: string[], session: ClientSession) {
    return this.model.updateMany(
      { _id: { $nin: activeIds } },
      { $set: { available: false } }
    ).session(session);
  }

  async updateMany(filter: any, update: any, session: ClientSession) {
    return this.model.updateMany(filter, update).session(session);
  }
}