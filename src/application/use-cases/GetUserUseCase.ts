import { UserEntity, UserId, UserRepository } from '@/domain'

interface CacheEntry {
    promise: Promise<UserEntity | null>
    expiresAt: number
}

export class GetUserUseCase {
    private cache = new Map<string, CacheEntry>()
    private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

    constructor(private readonly userRepository: UserRepository) {}

    async get(userId: UserId): Promise<UserEntity | null> {
        const key = userId.value
        const now = Date.now()

        // Check cache and return if still valid
        const cached = this.cache.get(key)
        if (cached && now < cached.expiresAt) {
            return cached.promise
        }

        // Create new request promise
        const promise = this.userRepository.getUser(userId)

        // Cache the promise with expiration
        this.cache.set(key, {
            promise,
            expiresAt: now + this.CACHE_TTL
        })

        return promise
    }

    /**
     * Clear all cached users
     */
    clearCache(): void {
        this.cache.clear()
    }

    /**
     * Invalidate a specific user from cache
     */
    invalidateUser(userId: UserId): void {
        this.cache.delete(userId.value)
    }
}
