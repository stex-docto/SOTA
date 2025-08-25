import {EventId, RoomEntity, RoomId} from '@/domain';

export interface RoomRepository {
    save(room: RoomEntity): Promise<void>;

    findById(id: RoomId): Promise<RoomEntity | null>;

    findByEventId(eventId: EventId): Promise<RoomEntity[]>;

    delete(id: RoomId): Promise<void>;
}