import {EventId, TalkEntity, TalkId} from '@/domain';

export interface TalkRepository {
    save(talk: TalkEntity): Promise<void>;

    findById(id: TalkId): Promise<TalkEntity | null>;

    findByEventId(eventId: EventId): Promise<TalkEntity[]>;
    
    delete(id: TalkId): Promise<void>;
}