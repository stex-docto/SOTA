import { ProfileEntity } from '../entities/Profile';
import { UserId } from '../value-objects/UserId';

export interface ProfileRepository {
  save(profile: ProfileEntity): Promise<void>;
  findById(id: UserId): Promise<ProfileEntity | null>;
  subscribeToProfile(id: UserId, callback: (profile: ProfileEntity | null) => void): () => void;
  subscribeToProfiles(userIds: UserId[], callback: (profiles: ProfileEntity[]) => void): () => void;
  delete(id: UserId): Promise<void>;
}