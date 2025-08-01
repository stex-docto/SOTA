import { EventEntity } from '../entities/Event';
import { EventId } from '../value-objects/EventId';
import { UserId } from '../value-objects/UserId';

export interface EventRepository {
  save(event: EventEntity): Promise<void>;
  findById(id: EventId): Promise<EventEntity | null>;
  findByPublicUrl(publicUrl: string): Promise<EventEntity | null>;
  findByAdminUrl(adminUrl: string): Promise<EventEntity | null>;
  findByAdminId(adminId: UserId): Promise<EventEntity[]>;
  delete(id: EventId): Promise<void>;
}