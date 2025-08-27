import { EventId } from '@/domain'

export class EventIdSet {
    private readonly eventIds: Map<string, EventId>

    constructor(eventIds: EventId[] = []) {
        this.eventIds = new Map()
        eventIds.forEach(id => {
            this.eventIds.set(id.value, id)
        })
    }

    add(eventId: EventId): EventIdSet {
        const newEventIds = new Map(this.eventIds)
        newEventIds.set(eventId.value, eventId)
        return new EventIdSet(Array.from(newEventIds.values()))
    }

    remove(eventId: EventId): EventIdSet {
        const newEventIds = new Map(this.eventIds)
        newEventIds.delete(eventId.value)
        return new EventIdSet(Array.from(newEventIds.values()))
    }

    has(eventId: EventId): boolean {
        return this.eventIds.has(eventId.value)
    }

    get size(): number {
        return this.eventIds.size
    }

    toArray(): EventId[] {
        return Array.from(this.eventIds.values())
    }

    [Symbol.iterator](): Iterator<EventId> {
        return this.eventIds.values()
    }
}
