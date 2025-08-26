import { EventId, UserId, RoomId, RoomEntity } from "@/domain";
import { RoomSet } from "@/domain/value-objects/RoomSet";

export interface Event {
    id: EventId
    title: string
    description: string
    talkRules: string
    publicUrl: string
    createdDate: Date
    startDate: Date
    endDate: Date
    location: string
    status: 'active' | 'inactive'
    createdBy: UserId,
    rooms: RoomSet;
}

export class EventEntity implements Event {
  constructor(
    public readonly id: EventId,
    public readonly title: string,
    public readonly description: string,
    public readonly talkRules: string,
    public readonly publicUrl: string,
    public readonly createdDate: Date,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly location: string,
    public readonly status: "active" | "inactive",
    public readonly createdBy: UserId,
    public readonly rooms: RoomSet = new RoomSet()
  ) {}

  static create(
    title: string,
    description: string,
    talkRules: string,
    startDate: Date,
    endDate: Date,
    location: string,
    createdBy: UserId,
    id?: EventId
  ): EventEntity {
    const eventId = id || EventId.generate()
    const publicUrl = `#/event/${eventId.value}`

    return new EventEntity(
      eventId,
      title,
      description,
      talkRules,
      publicUrl,
      new Date(),
      startDate,
      endDate,
      location,
      "active",
      createdBy,
      new RoomSet()
    );
  }

  addRoom(room: RoomEntity): EventEntity {
    const newRooms = this.rooms.add(room);

    return new EventEntity(
      this.id,
      this.title,
      this.description,
      this.talkRules,
      this.publicUrl,
      this.createdDate,
      this.startDate,
      this.endDate,
      this.location,
      this.status,
      this.createdBy,
      newRooms
    );
  }

  updateRoom(room: RoomEntity): EventEntity {
    if (!this.rooms.has(room.id)) {
      throw new Error("Room not found")
    }

    const newRooms = this.rooms.add(room);

    return new EventEntity(
      this.id,
      this.title,
      this.description,
      this.talkRules,
      this.publicUrl,
      this.createdDate,
      this.startDate,
      this.endDate,
      this.location,
      this.status,
      this.createdBy,
      newRooms
    );
  }

  removeRoom(roomId: RoomId): EventEntity {
    if (!this.rooms.has(roomId)) {
      throw new Error("Room not found");
    }

    const newRooms = this.rooms.remove(roomId);

    return new EventEntity(
      this.id,
      this.title,
      this.description,
      this.talkRules,
      this.publicUrl,
      this.createdDate,
      this.startDate,
      this.endDate,
      this.location,
      this.status,
      this.createdBy,
      newRooms
    );
  }

  getRooms(): RoomEntity[] {
    return this.rooms.toArray();
  }
}
