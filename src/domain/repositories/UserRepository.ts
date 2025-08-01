import { UserEntity } from '../entities/User';
import { UserId } from '../value-objects/UserId';

export interface UserRepository {
  save(user: UserEntity): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  delete(id: UserId): Promise<void>;
}