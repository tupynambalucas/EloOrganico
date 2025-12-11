import { FastifyReply, FastifyRequest } from 'fastify';
import { CycleService } from './cycle.service';
import { FastifyZodHandler } from '../../types/fastify';
import { 
  CreateCycleRoute,
  GetHistoryRoute,
  GetByIdRoute,
  UpdateCycleRoute
} from './cycle.schema';

export class CycleController {
  constructor(private service: CycleService) {}

  private mapToResponse(cycle: any) {
    if (!cycle) return null;
    
    const obj = typeof cycle.toObject === 'function' ? cycle.toObject() : cycle;

    return {
      ...obj,
      _id: obj._id?.toString(),
      openingDate: obj.openingDate ? new Date(obj.openingDate).toISOString() : undefined,
      closingDate: obj.closingDate ? new Date(obj.closingDate).toISOString() : undefined,
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
      products: Array.isArray(obj.products) ? obj.products.map((p: any) => {
        if (!p) return null;
        
        if (p._id && typeof p._id.toString === 'function' && p.name) {
          return {
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
          };
        }
        
        return p.toString();
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
    const { products } = req.body;
    const result = await this.service.updateCycle(req.params.id, products);
    return reply.send(this.mapToResponse(result));
  }
}