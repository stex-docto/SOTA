import {LocationEntity} from '../entities/Location';
import {LocationId} from '@/domain';
import {EventId} from '../value-objects/EventId';

export interface LocationRepository {
    save(location: LocationEntity): Promise<void>;

    findById(id: LocationId): Promise<LocationEntity | null>;

    findByEventId(eventId: EventId): Promise<LocationEntity[]>;

    delete(id: LocationId): Promise<void>;
}