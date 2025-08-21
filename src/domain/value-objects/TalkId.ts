import {EntityId} from './EntityId';

export class TalkId extends EntityId {
    static generate(): TalkId {
        return new TalkId(this.generateId());
    }

    static from(value: string): TalkId {
        return new TalkId(value);
    }
}