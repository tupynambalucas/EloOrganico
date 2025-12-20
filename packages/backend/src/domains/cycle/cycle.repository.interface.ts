import { ClientSession, UpdateWriteOpResult } from 'mongoose';
import { ICycleDocument } from '../../models/cycle.model';

export interface ICycleRepository {
  findActive(): Promise<ICycleDocument | null>;
  findHistory(page: number, limit: number, startDate?: string, endDate?: string): Promise<{ cycles: ICycleDocument[]; total: number }>;
  findById(id: string): Promise<ICycleDocument | null>;
  findByIdWithSession(id: string, session: ClientSession): Promise<ICycleDocument | null>;
  archiveExpired(toleranceDate: Date, session?: ClientSession): Promise<UpdateWriteOpResult>;
  deactivateAll(session: ClientSession): Promise<UpdateWriteOpResult>;
  create(data: Partial<ICycleDocument>, session: ClientSession): Promise<ICycleDocument>;
  save(document: ICycleDocument, session: ClientSession): Promise<ICycleDocument>;
}