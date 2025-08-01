import { LocationId } from '../value-objects/LocationId';
import { EventId } from '../value-objects/EventId';
import { UserId } from '../value-objects/UserId';

export interface Location {
  id: LocationId;
  eventId: EventId;
  name: string;
  description: string;
  createdBy: UserId;
  createdDate: Date;
}

export class LocationEntity implements Location {
  constructor(
    public readonly id: LocationId,
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
    id?: LocationId
  ): LocationEntity {
    return new LocationEntity(
      id || LocationId.generate(),
      eventId,
      name,
      description,
      createdBy,
      new Date()
    );
  }

  update(name?: string, description?: string): LocationEntity {
    return new LocationEntity(
      this.id,
      this.eventId,
      name ?? this.name,
      description ?? this.description,
      this.createdBy,
      this.createdDate
    );
  }
}