import {EntityId} from './EntityId';

export class LocationId extends EntityId {
    static generate(): LocationId {
        return new LocationId(this.generateId());
    }

    static from(value: string): LocationId {
        return new LocationId(value);
    }
}