import { EventId } from '../value-objects/EventId';
import { UserId } from '../value-objects/UserId';

export interface Event {
  id: EventId;
  name: string;
  publicUrl: string;
  adminUrl: string;
  createdDate: Date;
  adminIds: UserId[];
  eventDates: Date[];
  status: 'active' | 'inactive';
  createdBy: UserId;
}

export class EventEntity implements Event {
  constructor(
    public readonly id: EventId,
    public readonly name: string,
    public readonly publicUrl: string,
    public readonly adminUrl: string,
    public readonly createdDate: Date,
    public readonly adminIds: UserId[],
    public readonly eventDates: Date[],
    public readonly status: 'active' | 'inactive',
    public readonly createdBy: UserId
  ) {}

  static create(
    name: string,
    createdBy: UserId,
    id?: EventId
  ): EventEntity {
    const eventId = id || EventId.generate();
    const publicUrl = `/event/${eventId.value}`;
    const adminUrl = `/event/${eventId.value}/admin/${EventId.generateToken()}`;
    
    return new EventEntity(
      eventId,
      name,
      publicUrl,
      adminUrl,
      new Date(),
      [createdBy],
      [],
      'active',
      createdBy
    );
  }

  isAdmin(userId: UserId): boolean {
    return this.adminIds.some(adminId => adminId.equals(userId));
  }

  addAdmin(userId: UserId): EventEntity {
    if (this.isAdmin(userId)) {
      return this;
    }
    
    return new EventEntity(
      this.id,
      this.name,
      this.publicUrl,
      this.adminUrl,
      this.createdDate,
      [...this.adminIds, userId],
      this.eventDates,
      this.status,
      this.createdBy
    );
  }
}