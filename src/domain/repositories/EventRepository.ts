import {EventEntity, EventId} from '@/domain';


export interface EventRepository {
    save(event: EventEntity): Promise<void>;

    findById(id: EventId): Promise<EventEntity | null>;

    delete(id: EventId): Promise<void>;
}