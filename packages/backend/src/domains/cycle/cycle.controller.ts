import type { z } from 'zod';
import type { CycleResponseSchema } from '@elo-organico/shared';
import type { CycleService } from './cycle.service.js';
import type { FastifyZodHandler } from '../../types/fastify.js';
import type { ICycleDocument } from '../../models/cycle.model.js';
import { AppError } from '../../utils/AppError.js';
import type {
  CreateCycleRoute,
  GetHistoryRoute,
  GetByIdRoute,
  UpdateCycleRoute,
} from './cycle.schema.js';

type CycleResponse = z.infer<typeof CycleResponseSchema>;

interface CyclePlainObject {
  _id: { toString(): string };
  description: string;
  openingDate: Date;
  closingDate: Date;
  isActive: boolean;
  products: Array<{ _id: { toString(): string } } | { toString(): string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CycleController {
  constructor(private readonly service: CycleService) {}

  private mapToResponse(cycle: ICycleDocument | null): CycleResponse {
    if (!cycle) {
      throw new AppError('CYCLE_MAPPING_FAILED', 500);
    }

    const obj = cycle.toObject() as CyclePlainObject;

    const mappedProducts = obj.products.map((p) => {
      if (typeof p === 'object' && p !== null && '_id' in p) {
        return p._id.toString();
      }
      return p.toString();
    });

    return {
      _id: obj._id.toString(),
      description: obj.description,
      openingDate: obj.openingDate.toISOString(),
      closingDate: obj.closingDate.toISOString(),
      isActive: obj.isActive,
      createdAt: obj.createdAt?.toISOString(),
      updatedAt: obj.updatedAt?.toISOString(),
      products: mappedProducts as CycleResponse['products'],
    };
  }

  public getActiveCycleHandler: FastifyZodHandler<Record<string, never>> = async (
    _req,
    reply,
  ): Promise<void> => {
    const activeCycle = await this.service.getActive();
    if (!activeCycle) {
      void reply.status(204).send();
      return;
    }
    void reply.send(this.mapToResponse(activeCycle));
  };

  public getCycleHistoryHandler: FastifyZodHandler<GetHistoryRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const { page, limit, startDate, endDate } = req.query;
    const result = await this.service.getHistory(page, limit, startDate, endDate);

    void reply.send({
      data: result.cycles.map((c) => this.mapToResponse(c)),
      pagination: {
        total: result.total,
        page,
        pages: Math.ceil(result.total / limit),
      },
    });
  };

  public getCycleByIdHandler: FastifyZodHandler<GetByIdRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const cycle = await this.service.getById(req.params.id);
    void reply.send(this.mapToResponse(cycle));
  };

  public createCycleHandler: FastifyZodHandler<CreateCycleRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const result = await this.service.createCycle(req.body);
    void reply.status(201).send(this.mapToResponse(result));
  };

  public updateCycleHandler: FastifyZodHandler<UpdateCycleRoute> = async (
    req,
    reply,
  ): Promise<void> => {
    const result = await this.service.updateCycle(req.params.id, req.body.products);
    void reply.send(this.mapToResponse(result));
  };
}
