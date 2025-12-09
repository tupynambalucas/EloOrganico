import { FastifyReply, FastifyRequest } from 'fastify';
import { CycleService } from './cycle.service';
import { FastifyZodHandler } from '../../types/fastify'; // Importe o novo tipo
import { 
  CreateCycleBodyType,
  HistoryQueryType, 
  CycleIdParamType, 
  UpdateCycleBodyType,
  UpdateCycleParamsType
} from './cycle.schema';

export class CycleController {
  constructor(private service: CycleService) {}

  // Handler simples não precisa de Zod generics
  getActiveCycleHandler: FastifyZodHandler<{}> = async (req, reply) => {
    const activeCycle = await this.service.getActive();
    if (!activeCycle) return reply.status(204).send();
    return reply.send(activeCycle);
  }

  // Agora tipamos a VARIÁVEL, e o (req, reply) é inferido automaticamente
  getCycleHistoryHandler: FastifyZodHandler<{ Querystring: HistoryQueryType }> = async (req, reply) => {
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

  getCycleByIdHandler: FastifyZodHandler<{ Params: CycleIdParamType }> = async (req, reply) => {
    try {
      const cycle = await this.service.getById(req.params.id);
      return reply.send(cycle);
    } catch (error: any) {
      return reply.status(404).send({ message: error.message });
    }
  }

  createCycleHandler: FastifyZodHandler<{ Body: CreateCycleBodyType }> = async (req, reply) => {
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

  updateCycleHandler: FastifyZodHandler<{ 
    Params: UpdateCycleParamsType, 
    Body: UpdateCycleBodyType 
  }> = async (req, reply) => {
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