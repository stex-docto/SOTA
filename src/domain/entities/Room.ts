import { RoomId } from '@/domain'

export interface Room {
    id: RoomId
    name: string
    description: string
}

export class RoomEntity implements Room {
    constructor(
        public readonly id: RoomId,
        public readonly name: string,
        public readonly description: string
    ) {}

    static create(name: string, description: string, id?: RoomId): RoomEntity {
        return new RoomEntity(id || RoomId.generate(), name, description)
    }

    update(name?: string, description?: string): RoomEntity {
        return new RoomEntity(this.id, name ?? this.name, description ?? this.description)
    }
}
