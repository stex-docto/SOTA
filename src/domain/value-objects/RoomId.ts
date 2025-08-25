import {EntityId} from './EntityId';

export class RoomId extends EntityId {
    static generate(): RoomId {
        return new RoomId(this.generateId());
    }

    static from(value: string): RoomId {
        return new RoomId(value);
    }
}