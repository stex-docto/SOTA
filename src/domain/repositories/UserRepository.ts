import { UserEntity } from '../entities/User';
import { UserId } from '../value-objects/UserId';

export interface UserRepository {
  save(user: UserEntity): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
  subscribeToUser(id: UserId, callback: (user: UserEntity | null) => void): () => void;
  addSavedEventUrl(userId: UserId, eventUrl: string): Promise<void>;
  removeSavedEventUrl(userId: UserId, eventUrl: string): Promise<void>;
  delete(id: UserId): Promise<void>;
}