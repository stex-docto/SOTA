import {EventEntity, EventId} from '@/domain';


export interface EventRepository {
    save(event: EventEntity): Promise<void>;

    findById(id: EventId): Promise<EventEntity | null>;

    subscribe(id: EventId, callback: (event: EventEntity | null) => void): () => void;

    delete(id: EventId): Promise<void>;
}