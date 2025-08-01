import { UserId } from '../value-objects/UserId';
import { EventId } from '../value-objects/EventId';

export type AuthMethod = 'email' | 'google';

export interface User {
  id: UserId;
  email: string;
  displayName: string;
  authMethod: AuthMethod;
  registrationDate: Date;
  adminEventIds: EventId[];
}

export class UserEntity implements User {
  constructor(
    public readonly id: UserId,
    public readonly email: string,
    public readonly displayName: string,
    public readonly authMethod: AuthMethod,
    public readonly registrationDate: Date,
    public readonly adminEventIds: EventId[]
  ) {}

  static create(
    email: string,
    displayName: string,
    authMethod: AuthMethod,
    id?: UserId
  ): UserEntity {
    return new UserEntity(
      id || UserId.generate(),
      email,
      displayName,
      authMethod,
      new Date(),
      []
    );
  }

  addAdminEvent(eventId: EventId): UserEntity {
    if (this.isAdminOf(eventId)) {
      return this;
    }

    return new UserEntity(
      this.id,
      this.email,
      this.displayName,
      this.authMethod,
      this.registrationDate,
      [...this.adminEventIds, eventId]
    );
  }

  isAdminOf(eventId: EventId): boolean {
    return this.adminEventIds.some(adminEventId => adminEventId.equals(eventId));
  }

  updateProfile(displayName?: string): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      displayName ?? this.displayName,
      this.authMethod,
      this.registrationDate,
      this.adminEventIds
    );
  }
}