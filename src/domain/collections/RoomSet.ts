import { RoomId, RoomEntity } from '@/domain'

export class RoomSet {
    private readonly rooms: Map<string, RoomEntity>

    constructor(rooms: RoomEntity[] = []) {
        this.rooms = new Map()
        rooms.forEach(room => {
            this.rooms.set(room.id.value, room)
        })
    }

    add(room: RoomEntity): RoomSet {
        const newRooms = new Map(this.rooms)
        newRooms.set(room.id.value, room)
        return new RoomSet(Array.from(newRooms.values()))
    }

    remove(roomId: RoomId): RoomSet {
        const newRooms = new Map(this.rooms)
        newRooms.delete(roomId.value)
        return new RoomSet(Array.from(newRooms.values()))
    }

    find(roomId: RoomId): RoomEntity | undefined {
        return this.rooms.get(roomId.value)
    }

    has(roomId: RoomId): boolean {
        return this.rooms.has(roomId.value)
    }

    get size(): number {
        return this.rooms.size
    }

    toArray(): RoomEntity[] {
        return Array.from(this.rooms.values())
    }

    [Symbol.iterator](): Iterator<RoomEntity> {
        return this.rooms.values()
    }

    // Internal method for Firebase serialization
    forEach(callbackfn: (room: RoomEntity, roomId: RoomId) => void): void {
        this.rooms.forEach((room, roomIdString) => {
            callbackfn(room, RoomId.from(roomIdString))
        })
    }
}
