import { EventId, LocationEntity, LocationId } from '@/domain';

export interface LocationRepository {
    save(location: LocationEntity): Promise<void>;

    findById(id: LocationId): Promise<LocationEntity | null>;

    findByEventId(eventId: EventId): Promise<LocationEntity[]>;

    delete(id: LocationId): Promise<void>;
}
