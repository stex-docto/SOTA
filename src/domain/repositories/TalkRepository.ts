import { TalkEntity, TalkStatus } from '../entities/Talk';
import { TalkId } from '../value-objects/TalkId';
import { EventId } from '../value-objects/EventId';
import { UserId } from '../value-objects/UserId';

export interface TalkRepository {
  save(talk: TalkEntity): Promise<void>;
  findById(id: TalkId): Promise<TalkEntity | null>;
  findByEventId(eventId: EventId): Promise<TalkEntity[]>;
  findByEventIdAndStatus(eventId: EventId, status: TalkStatus): Promise<TalkEntity[]>;
  findByUserId(userId: UserId): Promise<TalkEntity[]>;
  findByEventIdAndUserId(eventId: EventId, userId: UserId): Promise<TalkEntity[]>;
  delete(id: TalkId): Promise<void>;
}