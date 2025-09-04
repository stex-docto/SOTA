import { EventId, EventIdSet, UserId } from '@/domain'

export type PublicUser = {
    id: UserId
    displayName: string
}

export type PrivateUser = {
    id: UserId
    savedEventIds: EventIdSet
}

export type User = PublicUser & PrivateUser

export class UserEntity implements User {
    constructor(
        public readonly id: UserId = UserId.generate(),
        public readonly savedEventIds: EventIdSet = new EventIdSet(),
        public readonly displayName: string = ''
    ) {}

    addSavedEvent(eventId: EventId): UserEntity {
        const newSavedEvents = this.savedEventIds.add(eventId)
        return new UserEntity(this.id, newSavedEvents, this.displayName)
    }

    removeSavedEvent(eventId: EventId): UserEntity {
        const newSavedEvents = this.savedEventIds.remove(eventId)
        return new UserEntity(this.id, newSavedEvents, this.displayName)
    }

    hasEventSaved(eventId: EventId): boolean {
        return this.savedEventIds.has(eventId)
    }
}
