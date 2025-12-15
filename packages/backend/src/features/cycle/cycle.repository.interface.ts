import { ClientSession } from 'mongoose';
import { ICycleDocument } from '../../models/cycle.model';

export interface ICycleRepository {
  findActive(): Promise<ICycleDocument | null>;
  findHistory(query: any, skip: number, limit: number): Promise<{ cycles: ICycleDocument[]; total: number }>;
  findById(id: string): Promise<ICycleDocument | null>;
  findByIdWithSession(id: string, session: ClientSession): Promise<ICycleDocument | null>;
  deactivateAll(session: ClientSession): Promise<any>;
  create(data: any, session: ClientSession): Promise<ICycleDocument>;
  save(document: ICycleDocument, session: ClientSession): Promise<ICycleDocument>;
}