import {Credential, UserEntity, UserId} from '@/domain';

export interface UserRepository {
    getUser(uid: UserId): Promise<UserEntity | null>;

    getCurrentUser(): Promise<UserEntity | null>;

    saveUser(user: UserEntity): Promise<UserEntity>;

    subscribeToCurrentUser(callback: (user: UserEntity | null) => Promise<void>): () => void;

    deleteCurrentUser(credential: Credential): Promise<void>;

    signIn(credential: Credential): Promise<void>;

    signOut(): Promise<void>;
}