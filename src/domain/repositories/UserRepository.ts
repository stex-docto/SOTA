import { Credential, UserEntity, UserId } from '@/domain'

export type CurrentUserListener = (user: UserEntity | null) => Promise<void>
export type PublicUserListener = (user: UserEntity) => Promise<void>

export interface UserRepository {
    getUser(uid: UserId): Promise<UserEntity | null>

    getCurrentUser(): Promise<UserEntity | null>

    saveUser(user: UserEntity): Promise<UserEntity>

    subscribeToCurrentUser(callback: CurrentUserListener): () => void

    subscribeToPublicUser(userId: UserId, callback: PublicUserListener): () => void

    deleteCurrentUser(credential: Credential): Promise<void>

    signIn(credential: Credential, signup?: boolean): Promise<void>

    signOut(): Promise<void>
}
