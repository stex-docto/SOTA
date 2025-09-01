import { EventId, RoomId, TalkId, UserId } from '@/domain'

export interface Talk {
    id: TalkId
    createdBy: UserId
    name: string
    pitch: string
    startDateTime: Date
    endDateTime: Date
    roomId: RoomId
}

export class TalkEntity implements Talk {
    constructor(
        public readonly id: TalkId,
        public readonly createdBy: UserId,
        public readonly name: string,
        public readonly pitch: string,
        public readonly startDateTime: Date,
        public readonly endDateTime: Date,
        public readonly roomId: RoomId
    ) {}

    static create(
        id: TalkId | EventId,
        createdBy: UserId,
        name: string,
        pitch: string,
        startDateTime: Date,
        expectedDurationMinutes: number,
        roomId: RoomId
    ): TalkEntity {
        const endDateTime = new Date(startDateTime)
        endDateTime.setMinutes(endDateTime.getMinutes() + expectedDurationMinutes)

        return new TalkEntity(
            id instanceof TalkId ? id : TalkId.generate(id),
            createdBy,
            name,
            pitch,
            startDateTime,
            endDateTime,
            roomId
        )
    }

    update(
        name?: string,
        pitch?: string,
        startDateTime?: Date,
        expectedDurationMinutes?: number,
        roomId?: RoomId
    ): TalkEntity {
        const newStartDateTime = startDateTime ?? this.startDateTime
        let newEndDateTime = this.endDateTime

        if (expectedDurationMinutes !== undefined) {
            newEndDateTime = new Date(newStartDateTime)
            newEndDateTime.setMinutes(newEndDateTime.getMinutes() + expectedDurationMinutes)
        } else if (startDateTime) {
            // If only start time changes, maintain the same duration
            const currentDurationMs = this.endDateTime.getTime() - this.startDateTime.getTime()
            newEndDateTime = new Date(newStartDateTime.getTime() + currentDurationMs)
        }

        return new TalkEntity(
            this.id,
            this.createdBy,
            name ?? this.name,
            pitch ?? this.pitch,
            newStartDateTime,
            newEndDateTime,
            roomId ?? this.roomId
        )
    }

    isOwnedBy(userId: UserId): boolean {
        return this.createdBy.equals(userId)
    }

    getDurationMinutes(): number {
        return Math.round((this.endDateTime.getTime() - this.startDateTime.getTime()) / (1000 * 60))
    }
}
