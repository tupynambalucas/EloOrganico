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

  getActiveCycleHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const activeCycle = await this.service.getActive();
    if (!activeCycle) return reply.status(204).send();
    return reply.send(activeCycle);
  }

  getCycleHistoryHandler: FastifyZodHandler<GetHistoryRoute> = async (req, reply) => {
    const { page, limit, startDate, endDate } = req.query;
    
    const result = await this.service.getHistory(page, limit, startDate, endDate);
    
    return reply.send({
      data: result.cycles,
      pagination: {
        total: result.total,
        page,
        pages: Math.ceil(result.total / limit)
      }
    });
  }

  getCycleByIdHandler: FastifyZodHandler<GetByIdRoute> = async (req, reply) => {
    try {
      const cycle = await this.service.getById(req.params.id);
      return reply.send(cycle);
    } catch (error: any) {
      return reply.status(404).send({ message: error.message });
    }
  }

  createCycleHandler: FastifyZodHandler<CreateCycleRoute> = async (req, reply) => {
    try {
      const result = await this.service.createCycle(req.body);
      return reply.status(201).send(result);
    } catch (error: any) {
      req.log.error(error);
      return reply.status(500).send({ 
        message: 'Erro interno ao processar ciclo', 
        error: error.message 
      });
    }
  }

  updateCycleHandler: FastifyZodHandler<UpdateCycleRoute> = async (req, reply) => {
    try {
      const result = await this.service.updateCycle(req.params.id, req.body);
      return reply.send(result);
    } catch (error: any) {
      req.log.error(error);
      return reply.status(500).send({ 
        message: 'Erro ao atualizar ciclo e produtos', 
        error: error.message 
      });
    }
  }
}