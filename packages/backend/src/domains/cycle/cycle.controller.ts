import { FastifyReply, FastifyRequest } from 'fastify';
import { CycleService } from './cycle.service.js';
import { FastifyZodHandler } from '../../types/fastify.js';
import { ICycleDocument } from '../../models/cycle.model.js';
import { 
  CreateCycleRoute,
  GetHistoryRoute,
  GetByIdRoute,
  UpdateCycleRoute
} from './cycle.schema.js';

export class CycleController {
  constructor(private service: CycleService) {}

  private mapToResponse(cycle: ICycleDocument | null): any {
    if (!cycle) return null;
    const obj = cycle.toObject ? cycle.toObject() : cycle;
    return {
      ...obj,
      _id: obj._id?.toString(),
      openingDate: obj.openingDate ? new Date(obj.openingDate).toISOString() : undefined,
      closingDate: obj.closingDate ? new Date(obj.closingDate).toISOString() : undefined,
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
      products: Array.isArray(obj.products) ? obj.products.map((p: any) => p?._id ? p._id.toString() : String(p)) : []
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
    const response = this.mapToResponse(result);
    return reply.status(201).send(response);
  }

  updateCycleHandler: FastifyZodHandler<UpdateCycleRoute> = async (req, reply) => {
    const result = await this.service.updateCycle(req.params.id, req.body.products);
    const response = this.mapToResponse(result);
    return reply.send(response);
  }
}