import { ClientSession, FilterQuery, UpdateWriteOpResult } from 'mongoose';
import { ICycleDocument } from '../../models/cycle.model';

export interface ICycleRepository {
  findActive(): Promise<ICycleDocument | null>;
  findHistory(query: FilterQuery<ICycleDocument>, skip: number, limit: number): Promise<{ cycles: ICycleDocument[]; total: number }>;
  findById(id: string): Promise<ICycleDocument | null>;
  findByIdWithSession(id: string, session: ClientSession): Promise<ICycleDocument | null>;
  archiveExpired(toleranceDate: Date, session?: ClientSession): Promise<UpdateWriteOpResult>;
  deactivateAll(session: ClientSession): Promise<UpdateWriteOpResult>;
  create(data: Partial<ICycleDocument>, session: ClientSession): Promise<ICycleDocument>;
  save(document: ICycleDocument, session: ClientSession): Promise<ICycleDocument>;
}