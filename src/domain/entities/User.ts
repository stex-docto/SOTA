import { UserId } from '../value-objects/UserId';

export interface User {
  id: UserId;
  savedEventUrls: string[];
}

export class UserEntity implements User {
  constructor(
    public readonly id: UserId,
    public readonly savedEventUrls: string[] = []
  ) {}

  static create(id?: UserId): UserEntity {
    return new UserEntity(
      id || UserId.generate(),
      []
    );
  }

  addSavedEventUrl(eventUrl: string): UserEntity {
    if (this.savedEventUrls.includes(eventUrl)) {
      return this;
    }
    return new UserEntity(this.id, [...this.savedEventUrls, eventUrl]);
  }

  removeSavedEventUrl(eventUrl: string): UserEntity {
    const updatedUrls = this.savedEventUrls.filter(url => url !== eventUrl);
    return new UserEntity(this.id, updatedUrls);
  }
}