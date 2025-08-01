import { EntityId } from './EntityId';

export class EventId extends EntityId {
  static generate(): EventId {
    return new EventId(this.generateId());
  }

  static from(value: string): EventId {
    return new EventId(value);
  }

  static generateToken(): string {
    return this.generateToken();
  }
}