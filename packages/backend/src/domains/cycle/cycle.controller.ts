import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { IProduct } from '@elo-organico/shared';
import { CycleService } from './cycle.service';
import { FastifyZodHandler } from '../../types/fastify';
import { ICycleDocument } from '../../models/cycle.model';
import { 
  CreateCycleRoute,
  GetHistoryRoute,
  GetByIdRoute,
  UpdateCycleRoute
} from './cycle.schema';

export class CycleController {
  constructor(private service: CycleService) {}

  private mapToResponse(cycle: ICycleDocument | null) {
    if (!cycle) return null;
    
    // Converte para objeto plano (POJO) para evitar problemas com getters do Mongoose
    const obj = cycle.toObject ? cycle.toObject() : cycle;

    return {
      ...obj,
      _id: obj._id?.toString(),
      openingDate: obj.openingDate ? new Date(obj.openingDate).toISOString() : undefined,
      closingDate: obj.closingDate ? new Date(obj.closingDate).toISOString() : undefined,
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
      products: Array.isArray(obj.products) ? obj.products.map((p: unknown) => {
        if (!p) return null;
        
        // Verifica se é um produto populado (objeto com _id e name)
        if (typeof p === 'object' && p !== null && '_id' in p && 'name' in p) {
          // Cast seguro: Afirmamos que 'p' tem a estrutura de um Produto + campos de DB
          const product = p as IProduct & { 
            _id: Types.ObjectId | string; 
            createdAt?: Date | string; 
            updatedAt?: Date | string; 
          };

          return {
            _id: product._id.toString(),
            name: product.name,
            category: product.category,
            measure: product.measure,
            content: product.content,
            available: product.available,
            createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined,
            updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
          };
        }
        
        // Se for um ObjectId ou objeto parcial, retorna apenas a string do ID
        if (typeof p === 'object' && p !== null && '_id' in p) {
            // Cast específico para extrair apenas o ID
            return (p as { _id: Types.ObjectId | string })._id.toString();
        }
        
        // Fallback para string simples (caso seja apenas um hash string)
        return String(p);
      }) : []
    };
  }

  getActiveCycleHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const activeCycle = await this.service.getActive();
    if (!activeCycle) return reply.status(204).send();
    return reply.send(this.mapToResponse(activeCycle));
  }

  getCycleHistoryHandler: FastifyZodHandler<GetHistoryRoute> = async (req, reply) => {
    const { page, limit, startDate, endDate } = req.query;
    
    const result = await this.service.getHistory(page, limit, startDate, endDate);
    
    return reply.send({
      data: result.cycles.map(c => this.mapToResponse(c)),
      pagination: {
        total: result.total,
        page,
        pages: Math.ceil(result.total / limit)
      }
    });
  }

  getCycleByIdHandler: FastifyZodHandler<GetByIdRoute> = async (req, reply) => {
    const cycle = await this.service.getById(req.params.id);
    return reply.send(this.mapToResponse(cycle));
  }

  createCycleHandler: FastifyZodHandler<CreateCycleRoute> = async (req, reply) => {
    const result = await this.service.createCycle(req.body);
    return reply.status(201).send(this.mapToResponse(result));
  }

  updateCycleHandler: FastifyZodHandler<UpdateCycleRoute> = async (req, reply) => {
    const result = await this.service.updateCycle(req.params.id, req.body.products);
    return reply.send(this.mapToResponse(result));
  }
}