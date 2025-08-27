import { EntityId } from './EntityId'
import { EventId } from '@/domain'

export class TalkId extends EntityId {
    constructor(
        public readonly eventId: EventId,
        public readonly value: string
    ) {
        super(value)
    }

    static generate(eventId: EventId): TalkId {
        return new TalkId(eventId, EntityId.generateId())
    }

    static from(eventId: EventId, talkId: string): TalkId {
        return new TalkId(eventId, talkId)
    }

    equals(other: TalkId): boolean {
        return this.eventId.equals(other.eventId) && this.value === other.value
    }

    toString(): string {
        return `${this.eventId.toString()}/${this.value.toString()}`
    }
}
