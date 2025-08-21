import { UserId } from '@/domain';

export type PublicUser = {
  id: UserId;
  displayName: string;
}

export type PrivateUser = {
  id: UserId;
  savedEventUrls: string[];
}

export type User = PublicUser & PrivateUser

export class UserEntity implements User {
  constructor(
    public readonly id: UserId = UserId.generate(),
    public readonly savedEventUrls: string[] = [],
    public readonly displayName: string = ""
  ) {}
}