import { EventId, RoomId, UserId } from '@/domain'

export interface Room {
    id: RoomId;
    eventId: EventId;
    name: string;
    description: string;
    createdBy: UserId;
    createdDate: Date;
}

export class RoomEntity implements Room {
    constructor(
        public readonly id: RoomId,
        public readonly eventId: EventId,
        public readonly name: string,
        public readonly description: string,
        public readonly createdBy: UserId,
        public readonly createdDate: Date
    ) {}

    static create(
        eventId: EventId,
        name: string,
        description: string,
        createdBy: UserId,
        id?: RoomId
    ): RoomEntity {
        return new RoomEntity(
            id || RoomId.generate(),
            eventId,
            name,
            description,
            createdBy,
            new Date()
        )
    }

    update(name?: string, description?: string): RoomEntity {
        return new RoomEntity(
            this.id,
            this.eventId,
            name ?? this.name,
            description ?? this.description,
            this.createdBy,
            this.createdDate
        )
    }
}
